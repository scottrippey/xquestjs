/**
 * This is a wrapper around createjs.Ticker
 * @constructor
 */
var EaselJSTimer = Smart.Class({
	addTickHandler: function(tickHandler) {
		// Configuration:
		createjs.Ticker.useRAF = true;
		createjs.Ticker.setFPS(60);

		createjs.Ticker.addEventListener('tick', function(tickEvent) {
			// Augment the tickEvent:
			tickEvent.deltaSeconds = tickEvent.delta / 1000;

			tickHandler(tickEvent);
		});
	}
	,
	dispose: function() {
		createjs.Ticker.removeAllEventListeners();
	}
});
