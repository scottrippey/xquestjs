export function Class(base, implement) {
  if (!implement) implement = base;
  var constructor = implement.hasOwnProperty("initialize") && implement["initialize"];
  if (!constructor) {
    constructor = function Class() {
      if (this.initialize) this.initialize.apply(this, arguments);
    };
  }

  constructor.prototype = base;

  constructor.extend = extendThis;
  constructor.implement = function (implement) {
    return extendThis.call(this.prototype, implement);
  };

  if (implement !== base) {
    constructor.implement(implement);
  }

  return constructor;
}

function extendThis(extend) {
  for (var key in extend) {
    // Takes the place of checking hasOwnProperty:
    if (this[key] === extend[key]) continue;
    this[key] = extend[key];
  }
  return this;
}
