var XBlaster = new Class({
	initialize: function(canvas) {

		this.gfx = new EaselJSGraphics(canvas);
		this.input = new BrowserInput(canvas);

		this.game = new ArcadeGame(this.gfx, this.input);
		this.game.start();
	}

});
