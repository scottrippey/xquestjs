var XQuest = new Class({
	initialize: function(canvas) {


		// Setup components:
		var gfx = new EaselJSGraphics(canvas);
		var timer = new EaselJSTimer();
		var input = new BrowserInput(canvas);

		// Start the game:
		var game = new ArcadeGame(gfx, input, timer);
	}

});
