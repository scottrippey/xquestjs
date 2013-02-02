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
		var background = new BackgroundGraphics(this.canvas);
		this.layers.background.addChild(background);
	}

	, onDraw: function(tickEvent) {
		this.layers.background.update(tickEvent);
		this.layers.effects.update(tickEvent);
		this.layers.characters.update(tickEvent);
	}

	, createLevelGraphics: function() {
		var levelGraphics = new LevelGraphics(this.canvas);
		this.layers.background.addChild(levelGraphics);
		return levelGraphics;
	}

	, createPlayerGraphics: function() {
		var playerGraphics = new PlayerGraphics();
		this.layers.characters.addChild(playerGraphics);
		return playerGraphics;
	}

	, createPlayerBullet: function() {
		var bulletGfx = new BulletGraphics();
		this.layers.effects.addChild(bulletGfx);
		return bulletGfx;
	}

});