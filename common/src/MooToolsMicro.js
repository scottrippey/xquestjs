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

var Color = {
	arrayToHex: function(array){
		if (array.length < 3) return null;
		if (array.length == 4 && array[3] == 0) return 'transparent';
		var hex = [];
		for (var i = 0; i < 3; i++){
			var bit = (array[i] - 0).toString(16);
			hex.push((bit.length == 1) ? '0' + bit : bit);
		}
		return '#' + hex.join('');
	}
	,
	parseToArray: function(color) {
		if (typeof color !== 'string') return color;

		return Color.hexToArray(color) || Color.rgbToArray(color);
	}
	,
	hexToArray: function(string){
		var hex = String(string).match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);
		if (hex) hex = hex.slice(1).map(function(h) { return parseInt(h, 16); });
		return hex;
	}
	,
	rgbToArray: function(string){
		var rgb = String(string).match(/\d{1,3}/g);
		if (rgb) rgb = rgb.map(function(d) { return parseInt(d, 10); });
		return rgb;
	}

};