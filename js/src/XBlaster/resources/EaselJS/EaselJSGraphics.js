var EaselJSGraphics = new Class({

	variables: {
		backgroundColor: 'black'
	}

	, initialize: function(canvas) {
		this.canvas = canvas;

		this._setupLayers();

		this._setupBackground();
	}
	, _setupLayers: function() {
		this.layers = {
			background: new Stage(this.canvas)
			, effects: new Stage(this.canvas)
			, characters: new Stage(this.canvas)
		};
	}
	, _setupBackground: function() {
		var background = new createjs.Shape();
		background.graphics
			.beginFill(this.variables.backgroundColor)
			.drawRect(0, 0, this.canvas.width, this.canvas.height);

		this.layers.background.addChild(background);
	}

	, draw: function(tickEvent, game) {
		this.layers.background.update();
		this.layers.effects.update();
		this.layers.characters.update();
	}


	, getPlayerGraphics: function() {
		var playerGraphics = new PlayerGraphics();

		this.layers.characters.addChild(playerGraphics);

		return playerGraphics;
	}
});