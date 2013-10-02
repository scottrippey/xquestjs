Smart.Events = Smart.Class({
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
