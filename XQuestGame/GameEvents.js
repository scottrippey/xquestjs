var GameEvents = Class.create({
	initialize: function GameEvents() {
		this._events = new Events();
	}
	,
	crystalsGathered: function(remainingCrystals, gatheredCrystals) {
		this._events.fireEvent('crystalsGathered', arguments);
	}
	,
	onCrystalsGathered: function(callback) {
		this._events.addEvent('crystalsGathered', callback);
	}
	,
	levelUp: function() {
		this._events.fireEvent('levelUp', arguments);
	}
	,
	onLevelUp: function(callback) {
		this._events.addEvent('levelUp', callback);
	}
	,
	playerDied: function() {
		this._events.fireEvent('playerDied', arguments);
	}
	,
	onPlayerDied: function(callback) {
		this._events.addEvent('playerDied', callback);
	}
});
