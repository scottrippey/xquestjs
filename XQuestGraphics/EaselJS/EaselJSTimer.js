/**
 * This is a wrapper around createjs.Ticker
 * @constructor
 */
var EaselJSTimer = Class.create(new createjs.Shape(), {
	initialize: function() {
		this._paused = false;
		window.pauseGame = this.pauseGame.bind(this);
	}
	,
	addTickHandler: function(tickHandler) {
		// Configuration:
		createjs.Ticker.useRAF = true;
		createjs.Ticker.setFPS(60);

		createjs.Ticker.addEventListener('tick', function(tickEvent) {
			if (tickEvent.paused) {
				return;
			}

			// Augment the tickEvent:
			tickEvent.deltaSeconds = tickEvent.delta / 1000;

			tickHandler(tickEvent);
		});
	}
	,
	pauseGame: function(paused) {
		this._paused = (paused !== undefined) ? paused : !this._paused;
		createjs.Ticker.setPaused(this._paused);
	}
});
