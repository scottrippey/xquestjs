Smart.Class = function(base, implement) {
	if (!implement) implement = base;
	var constructor = implement.hasOwnProperty('initialize') && implement['initialize'];
	if (!constructor) {
		constructor = function Class() {
			if (this.initialize) this.initialize.apply(this, arguments);
		};
	}

	constructor.prototype = base;
	if (implement !== base){
		for (var key in implement) {
			// Takes the place of checking hasOwnProperty:
			if (constructor.prototype[key] === implement[key]) continue;
			constructor.prototype[key] = implement[key];
		}
	}

	return constructor;
};
