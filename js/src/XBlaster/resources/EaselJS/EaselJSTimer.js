/**
 * This is a wrapper around createjs.Ticker
 * @constructor
 */
var EaselJSTimer = function() {

};
EaselJSTimer.implement({
	onTick: function(tickHandler) {
		createjs.Ticker.addEventListener('tick', tickHandler);
	}
	,
	pauseGame: function(paused) {
		createjs.Ticker.setPaused(paused);
	}
});