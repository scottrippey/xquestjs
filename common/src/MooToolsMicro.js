var Class = {
	create: function(base, implement) {
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
	}
};

var Events = Class.create({
	addEvent: function(eventName, callback) {
		if (!this.$events) this.$events = {};
		if (!this.$events[eventName]) this.$events[eventName] = [];

		this.$events[eventName].push(callback);
	}
	,
	fireEvent: function(eventName, args) {
		var callbacks = this.$events && this.$events[eventName];
		if (!callbacks) return;
		if (!args) args = [];

		for (var i = 0, l = callbacks.length; i < l; i++) {
			callbacks[i].apply(null, args);
		}
	}
});
