/**
 * This is a wrapper around createjs.Ticker
 * @constructor
 */
var EaselJSTimer = function() {

};
EaselJSTimer.implement({
	onTick: function(tickHandler) {
		createjs.Ticker.addEventListener('tick', function(tickEvent) {

			// Augment the tickEvent:
			tickEvent.deltaSeconds = tickEvent.delta / 1000;

			tickHandler(tickEvent);
		});
	}
	,
	pauseGame: function(paused) {
		createjs.Ticker.setPaused(paused);
	}
});