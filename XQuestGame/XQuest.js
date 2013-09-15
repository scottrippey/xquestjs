var XQuest = new Class({
	initialize: function(canvas) {
        if (!canvas)
		    console.error("You must provide a Canvas element!");

		Balance.setGameMode('arcade');

		// Setup components:
		var gfx = new EaselJSGraphics(canvas);
		var timer = new EaselJSTimer();
		var input = new GameInput();

		// Start the game:
		this.game = new ArcadeGame(gfx, input, timer);
	}

});
