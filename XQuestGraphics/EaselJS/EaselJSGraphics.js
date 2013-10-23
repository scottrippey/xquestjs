var EaselJSGraphics = Smart.Class({
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
			, hud: new createjs.Stage(this.canvas)
		};

		this.layers.background.autoClear = false;
		this.layers.effects.autoClear = false;
		this.layers.characters.autoClear = false;
		this.layers.hud.autoClear = false;
	}
	,
	_setupBackground: function() {
		var background = new EaselJSGraphics.BackgroundGraphics();
		this.layers.background.addChild(background);
	}
	,
	_setupParticles: function() {
		this.particleFactory = new EaselJSGraphics.ParticleFactory(this);
	}
	,
	onMove: function(tickEvent) {
		if (this.animations) {
			this.animations.update(tickEvent.deltaSeconds);
		}
	}
	,
	onAct: function(tickEvent) {
		this.particleFactory.updateParticles(tickEvent);
	}
	,
	onDraw: function(tickEvent) {
		this.layers.background.update(tickEvent);
		this.layers.effects.update(tickEvent);
		this.layers.characters.update(tickEvent);
		this.layers.hud.update(tickEvent);
	}
	,
	followPlayer: function(playerLocation) {

		var bounds = Balance.level.bounds;

		if (!this._maxOffset) {
			this._maxOffset = {
				x: bounds.totalWidth - bounds.visibleWidth
				,y: bounds.totalHeight - bounds.visibleHeight
			};
		}

		this._offset = {
			x: Math.min(Math.max(0, playerLocation.x - bounds.visibleWidth/2), this._maxOffset.x)
			,y: Math.min(Math.max(0, playerLocation.y - bounds.visibleHeight/2), this._maxOffset.y)
		};

		this.layers.background.x = -this._offset.x;
		this.layers.effects.x = -this._offset.x;
		this.layers.characters.x = -this._offset.x;

		this.layers.background.y = -this._offset.y;
		this.layers.effects.y = -this._offset.y;
		this.layers.characters.y = -this._offset.y;

	}
	,
	getGamePoint: function(gamePoint) {
		if (typeof gamePoint !== 'string') return gamePoint;
		var bounds = Balance.level.bounds;
		switch (gamePoint) {
			case 'visibleMiddle':
				return {
					x: this._offset.x + bounds.visibleWidth / 2
					,y: this._offset.y + bounds.visibleHeight / 2
				};
			case 'middle':
				return {
					x: bounds.x + bounds.width / 2
					,y: bounds.y + bounds.height / 2
				};
			case 'top':
				return {
					x: bounds.x + bounds.width / 2
					,y: bounds.y
				};
			case 'bottom':
				return {
					x: bounds.x + bounds.width / 2
					,y: bounds.y + bounds.height
				};
			case 'left':
				return {
					x: bounds.x
					, y: bounds.y + bounds.height / 2
				};
			case 'right':
				return {
					x: bounds.x + bounds.width
					, y: bounds.y + bounds.height / 2
				};
		}
	}
	,
	getHudPoint: function(hudPoint) {
		if (typeof hudPoint !== 'string') return hudPoint;
		var bounds = Balance.level.bounds;
		switch (hudPoint) {
			case 'middle':
				return { x: bounds.visibleWidth / 2, y: bounds.visibleHeight / 2 };
			case 'top':
				return { x: bounds.visibleWidth / 2, y: 0 };
			case 'bottom':
				return { x: bounds.visibleWidth / 2, y: bounds.visibleHeight };
			case 'left':
				return { x: 0, y: bounds.visibleHeight / 2 };
			case 'right':
				return {x: bounds.visibleWidth, y: bounds.visibleHeight / 2 };
		}
		return null;
	}
	,
	createLevelGraphics: function() {
		var levelGraphics = new EaselJSGraphics.LevelGraphics();
		this.layers.background.addChild(levelGraphics);
		return levelGraphics;
	}
	,
	createPlayerGraphics: function() {
		var playerGraphics = new EaselJSGraphics.PlayerGraphics();
		this.layers.characters.addChild(playerGraphics);
		return playerGraphics;
	}
	,
	createPlayerBullet: function() {
		var bulletGfx = new EaselJSGraphics.BulletGraphics();
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
				enemyGraphics = new EaselJSGraphics.SlugGraphics();
				break;
			case 'Locust':
				enemyGraphics = new EaselJSGraphics.LocustGraphics();
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
		this.layers.hud.removeChild(graphic);
	}
	,
	createCrystalGraphic: function() {
		var crystal = new EaselJSGraphics.CrystalGraphic();
		this.layers.background.addChild(crystal);
		return crystal;
	}
	,
	createPowerCrystalGraphic: function() {
		var powerCrystal = new EaselJSGraphics.PowerCrystalGraphic();
		this.layers.characters.addChild(powerCrystal);
		return powerCrystal;
	}
	,
	createExplosion: function(position, velocity, particleOptions) {
		particleOptions.position = position;
		particleOptions.velocity = { x: 0, y: 0 };

		var particleCount = particleOptions.count, partSpeed = particleOptions.speed;
		var random = function() { return 1 - Math.random() - Math.random(); }; // provides a more even spread than just Math.random()
		for (var i = 0; i < particleCount; i++) {
			particleOptions.velocity.x = velocity.x + partSpeed * random();
			particleOptions.velocity.y = velocity.y + partSpeed * random();

			var particle = this.particleFactory.createParticle(particleOptions);
			this.layers.effects.addChild(particle);
			particle.destroy = function(particle) {
				this.layers.effects.removeChild(particle);
			}.bind(this, particle);
		}
	}
	,
	addAnimation: function(animation) {
		if (!this.animations) {
			this.animations = new Smart.Animations();
		}
		return this.animations.addAnimation(animation);
	}

	,
	addText: function(text, textStyle) {
		var textGfx = new EaselJSGraphics.TextGraphic();
		textGfx.setGfx(this);
		textGfx.setText(text, textStyle);

		this.layers.hud.addChild(textGfx);
		textGfx.destroy = function(textGfx) {
			this.layers.hud.removeChild(textGfx);
		}.bind(this, textGfx);

		return textGfx;
	}
});
