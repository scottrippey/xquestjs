var EaselJSGraphics = new Class({
	initialize: function(canvas) {
		this.canvas = canvas;

		this._setupLayers();
		this._setupBackground();
		this._setupParticles();
	}
	,
	_setupLayers: function() {
		this.layers = {
			background: new createjs.Stage(this.canvas)
			, effects: new createjs.Stage(this.canvas)
			, characters: new createjs.Stage(this.canvas)
		};

		this.layers.background.autoClear = false;
		this.layers.effects.autoClear = false;
		this.layers.characters.autoClear = false;
	}
	,
	_setupBackground: function() {
		var background = new BackgroundGraphics();
		this.layers.background.addChild(background);
	}
	,
	_setupParticles: function() {
		this.particleFactory = new ParticleFactory(this);
	}
	,
	onAct: function(tickEvent) {
		this.particleFactory.updateParticles(tickEvent);
	}
	,
	onDraw: function(tickEvent) {
		this._followPlayer();

		this.layers.background.update(tickEvent);
		this.layers.effects.update(tickEvent);
		this.layers.characters.update(tickEvent);
	}
	,
	_followPlayer: function() {

		var width = this.canvas.width
			,height = this.canvas.height
			,player = this._playerLocation;


		if (!this._maxOffset) {

			var bounds = Graphics.level.bounds;
			this._maxOffset = {
				x: bounds.x*2 + bounds.width - width
				,y: bounds.y*2 + bounds.height - height
			};
		}

		var offsetX = Math.min(Math.max(0, player.x - width/2), this._maxOffset.x)
			,offsetY = Math.min(Math.max(0, player.y - height/2), this._maxOffset.y);

		this.layers.background.x = -offsetX;
		this.layers.characters.x = -offsetX;
		this.layers.effects.x = -offsetX;

		this.layers.background.y = -offsetY;
		this.layers.characters.y = -offsetY;
		this.layers.effects.y = -offsetY;

	}
	,
	createLevelGraphics: function() {
		var levelGraphics = new LevelGraphics();
		this.layers.background.addChild(levelGraphics);
		return levelGraphics;
	}
	,
	createPlayerGraphics: function() {
		var playerGraphics = new PlayerGraphics();
		this.layers.characters.addChild(playerGraphics);
		this._playerLocation = playerGraphics;
		return playerGraphics;
	}
	,
	createPlayerBullet: function() {
		var bulletGfx = new BulletGraphics();
		this.layers.effects.addChild(bulletGfx);
		bulletGfx.destroyBullet = function() {
			this.layers.effects.removeChild(bulletGfx);
		}.bind(this);
		return bulletGfx;
	}
	,
	createEnemyGraphics: function(enemyName) {
		var enemyGraphics = null;
		switch (enemyName) {
			case 'Slug':
				enemyGraphics = new SlugGraphics();
				break;
		}

		if (enemyGraphics == null)
			throw new Error("Unknown enemy: " + enemyName);

		this.layers.characters.addChild(enemyGraphics);

		return enemyGraphics;
	}
	,
	removeGraphic: function(graphic) {
		this.layers.background.removeChild(graphic);
		this.layers.effects.removeChild(graphic);
		this.layers.characters.removeChild(graphic);
	}
	,
	createCrystalGraphic: function() {
		var crystal = new CrystalGraphic(this);
		this.layers.background.addChild(crystal);
		return crystal;
	}
	,
	addParticle: function(particleOptions) {
		var particle = this.particleFactory.createParticle(particleOptions);
		this.layers.effects.addChild(particle);
		particle.destroy = function() {
			this.layers.effects.removeChild(particle);
		}.bind(this);
	}
});
