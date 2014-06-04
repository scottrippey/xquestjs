var XQuestHost = Smart.Class({
	initialize: function(canvas) {

		var graphics = new EaselJSGraphics(canvas);

		this.game = new ArcadeGame(graphics);

		new XQuestInput.KeyboardInput(this.game, null);
		new XQuestInput.MouseInput(this.game, canvas);
	}

});