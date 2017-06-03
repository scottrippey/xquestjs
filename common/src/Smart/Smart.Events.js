Smart.Events = Smart.Class({
	addEvent(eventName, callback) {
		if (!this.$events) this.$events = {};
		if (!this.$events[eventName]) this.$events[eventName] = [];

		this.$events[eventName].push(callback);
	},

	fireEvent(eventName, eventArgs) {
		var callbacks = this.$events && this.$events[eventName];
		if (!callbacks) return;
		if (!eventArgs) eventArgs = [];

		for (var i = 0, l = callbacks.length; i < l; i++) {
			callbacks[i].apply(null, eventArgs);
		}
	},

	implementEvents(events) {
		_.forOwn(events, function(eventName, eventMethodName) {
			this[eventMethodName] = function(eventHandler) {
				this.addEvent(eventName, eventHandler);
			};
		}, this);
		return this;
	}
});
