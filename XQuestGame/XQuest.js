var XQuest = new Class({
	initialize: function(canvas) {

		console.assert(canvas, "You must provide a Canvas element!");

		Balance.setGameMode('arcade');

		if (window.location.protocol === 'file:') {
			Balance.setGameMode('test');
		}

		// Setup components:
		var gfx = new EaselJSGraphics(canvas);
		var timer = new EaselJSTimer();
		var input = new BrowserInput(canvas);

		// Start the game:
		this.game = new ArcadeGame(gfx, input, timer);
	}

});
