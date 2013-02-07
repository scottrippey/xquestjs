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

		this.layers.background.autoClear = false;
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
		bulletGfx.destroyBullet = function() {
			this.layers.effects.removeChild(bulletGfx);
		}.bind(this);
		return bulletGfx;
	}

	, createEnemyGraphics: function(enemyName) {
		var enemyGraphics = null;
		switch (enemyName) {
			case 'Splat':
				enemyGraphics = new SplatGraphics();
				break;
		}

		if (enemyGraphics == null)
			throw new Error("Unknown enemy: " + enemyName);

		this.layers.characters.addChild(enemyGraphics);

		return enemyGraphics;
	}

	, removeGraphic: function(graphic) {
		this.layers.background.removeChild(graphic);
		this.layers.effects.removeChild(graphic);
		this.layers.characters.removeChild(graphic);
	}
});