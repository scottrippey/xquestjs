Smart.Class = function(base, implement) {
	var constructor = (implement || base).hasOwnProperty('initialize') && (implement || base)['initialize'];
	if (!constructor) {
		constructor = function Class() { };
	}

	constructor.prototype = base;
	if (implement){
		for (var key in implement) {
			// Takes the place of checking hasOwnProperty:
			if (constructor.prototype[key] === implement[key]) continue;
			constructor.prototype[key] = implement[key];
		}
	}

	return constructor;
};
