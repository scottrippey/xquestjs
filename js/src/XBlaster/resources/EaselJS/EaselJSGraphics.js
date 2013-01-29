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
			background: new createjs.Stage(this.canvas)
			, effects: new createjs.Stage(this.canvas)
			, characters: new createjs.Stage(this.canvas)
		};

		this.layers.effects.autoClear = false;
		this.layers.characters.autoClear = false;
	}
	, _setupBackground: function() {
		var background = new createjs.Shape();
		background.graphics
			.beginFill(this.variables.backgroundColor)
			.drawRect(0, 0, this.canvas.width, this.canvas.height);

		this.layers.background.addChild(background);
	}

	, onDraw: function(tickEvent) {
		this.layers.background.update(tickEvent);
		this.layers.effects.update(tickEvent);
		this.layers.characters.update(tickEvent);
	}


	, createPlayerGraphics: function() {
		var playerGraphics = new PlayerGraphics();

		this.layers.characters.addChild(playerGraphics);

		return playerGraphics;
	}
});