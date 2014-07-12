var EaselJSGraphics = Smart.Class({
	initialize: function(canvas) {
		this.canvas = canvas;

		this.debugStats = {
			allGraphics: []
		};

		this._setupLayers();
		this._setupAnimations();
		this._setupBulletsGraphics();
	}
	,
	_setupLayers: function() {
		this.layers = {
			background: new createjs.Stage(this.canvas)
			, objects: new createjs.Stage(this.canvas)
			, characters: new createjs.Stage(this.canvas)
			, hud: new createjs.Stage(this.canvas)
		};

		var allGraphics = this.debugStats.allGraphics;
		function trackChildren(stage) {
			var addChild = stage.addChild, removeChild = stage.removeChild;
			stage.addChild = function(child) {
				addChild.apply(this, arguments);
				allGraphics.push(child);
			};
			stage.removeChild = function(child) {
				removeChild.apply(this, arguments);
				_.eliminate(allGraphics, child);
			};
		}
		_.forOwn(this.layers, function(stage) {
			trackChildren(stage);
			stage.autoClear = false;
		});
		this.layers.hud.enableMouseOver();
	}
	,
	showBackgroundStars: function(visible) {
		if (visible) {
			if (!this.backgroundStars) {
				this.backgroundStars = new EaselJSGraphics.BackgroundGraphics();
			}
			this.layers.background.addChild(this.backgroundStars);
		} else {
			if (this.backgroundStars) {
				this.layers.background.removeChild(this.backgroundStars);
			}
		}
	}
	,
	_setupAnimations: function() {
		this.animations = new Smart.Animations();
	}
	,
	/** Creates a clone */
	createNewGraphics: function() {
		return new EaselJSGraphics(this.canvas);
	}
	,
	onMove: function(tickEvent) {
		this.animations.update(tickEvent.deltaSeconds);
	}
	,
	onDraw: function(tickEvent) {
		this.layers.background.update(tickEvent);
		this.layers.objects.update(tickEvent);
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
		this.layers.objects.x = -this._offset.x;
		this.layers.characters.x = -this._offset.x;

		this.layers.background.y = -this._offset.y;
		this.layers.objects.y = -this._offset.y;
		this.layers.characters.y = -this._offset.y;

	}
	,
	getSafeSpawn: function(radius) {
		var leftEnemySpawn = this.getGamePoint('left')
			, rightEnemySpawn = this.getGamePoint('right')
			, safeDistance = Balance.enemies.safeSpawnDistance;
		var randomSpot, isSafe;
		do {
			randomSpot = this.getGamePoint('random', radius);
			isSafe = !(Smart.Point.distanceTest(leftEnemySpawn, randomSpot, safeDistance)) && !(Smart.Point.distanceTest(rightEnemySpawn, randomSpot, safeDistance));
		} while (!isSafe);
		return randomSpot;
	}
	,
	getGamePoint: function(gamePoint, radius) {
		if (typeof gamePoint !== 'string') return gamePoint;
		if (radius == undefined) radius = 0;
		var bounds = Balance.level.bounds;
		switch (gamePoint) {
			case 'random':
				return {
					x: bounds.x + radius + (bounds.width - radius - radius) * Math.random()
					, y: bounds.y + radius + (bounds.height - radius - radius) * Math.random()
				};
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
					,y: bounds.y + radius
				};
			case 'bottom':
				return {
					x: bounds.x + bounds.width / 2
					,y: bounds.y + bounds.height - radius
				};
			case 'left':
				return {
					x: bounds.x + radius
					, y: bounds.y + bounds.height / 2
				};
			case 'right':
				return {
					x: bounds.x + bounds.width - radius
					, y: bounds.y + bounds.height / 2
				};
			default:
				throw "Invalid gamePoint: " + gamePoint;
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
		levelGraphics.onDispose(function() {
			this.layers.background.removeChild(levelGraphics);
		}.bind(this));
		return levelGraphics;
	}
	,
	createPlayerGraphics: function() {
		var playerGraphics = new EaselJSGraphics.PlayerGraphics();
		this.layers.characters.addChild(playerGraphics);
		return playerGraphics;
	}
	,
	createPlayerHUDIcon: function() {
		var playerGraphics = new EaselJSGraphics.PlayerGraphics();
		var scale = 0.7;
		playerGraphics.scaleTo(scale);
		playerGraphics.visibleRadius *= scale;
		this.layers.hud.addChild(playerGraphics);
		return playerGraphics;
	}
	,
	_setupBulletsGraphics: function() {
		this.bulletsGraphics = new EaselJSGraphics.BulletsGraphics();
		this.layers.objects.addChild(this.bulletsGraphics);
	}
	,
	createPlayerBullet: function() {
		var bulletGfx = this.bulletsGraphics.addBullet();
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
			case 'Mantis':
				enemyGraphics = new EaselJSGraphics.MantisGraphics();
				break;
		}

		if (enemyGraphics == null)
			throw new Error("Unknown enemy: " + enemyName);

		this.layers.characters.addChild(enemyGraphics);
		enemyGraphics.onDispose(function() {
			this.layers.characters.removeChild(enemyGraphics);
		}.bind(this));

		return enemyGraphics;
	}
	,
	createCrystalGraphic: function() {
		var crystal = new EaselJSGraphics.CrystalGraphic();
		this.layers.objects.addChild(crystal);
		crystal.onDispose(function() {
			this.layers.objects.removeChild(crystal);
		}.bind(this));
		return crystal;
	}
	,
	createCrystalHUDIcon: function() {
		var crystal = new EaselJSGraphics.CrystalGraphic();
		var scale = 0.7;
		crystal.scaleTo(scale);
		crystal.visibleRadius *= scale;
		this.layers.hud.addChild(crystal);
		return crystal;
	}
	,
	createPowerCrystalGraphic: function() {
		var powerCrystal = new EaselJSGraphics.PowerCrystalGraphic();
		this.layers.characters.addChild(powerCrystal);
		powerCrystal.onDispose(function() {
			this.layers.characters.removeChild(powerCrystal);
		}.bind(this));
		return powerCrystal;
	}
	,
	createBombCrystalGraphic: function() {
		var bombCrystal = new EaselJSGraphics.BombCrystalGraphic();
		this.layers.objects.addChild(bombCrystal);
		bombCrystal.onDispose(function() {
			this.layers.objects.removeChild(bombCrystal);
		}.bind(this));
		return bombCrystal;
	}
	,
	createBombCrystalHUDIcon: function() {
		var bombCrystal = new EaselJSGraphics.BombCrystalGraphic();
		var scale = 0.7;
		bombCrystal.scaleTo(scale);
		bombCrystal.visibleRadius *= scale;
		this.layers.hud.addChild(bombCrystal);
		bombCrystal.onDispose(function() {
			this.layers.hud.removeChild(bombCrystal);
		}.bind(this));
		return bombCrystal;
	}
	,
	createBombGraphic: function() {
		var bomb = new EaselJSGraphics.BombGraphic();
		this.layers.objects.addChild(bomb);
		bomb.onDispose(function() {
			this.layers.objects.removeChild(bomb);
		}.bind(this));
		return bomb;
	}
	,
	createExplosion: function(position, velocity, explosionOptions) {
		var explosion = new EaselJSGraphics.ExplosionGraphic(position, velocity, explosionOptions);
		this.layers.objects.addChild(explosion);
		explosion.onDispose(function() {
			this.layers.objects.removeChild(explosion);
		}.bind(this));
	}
	,
	addAnimation: function(animation) {
		return this.animations.addAnimation(animation);
	}

	,
	addText: function(text, textStyle) {
		var textGfx = new EaselJSGraphics.TextGraphic();
		textGfx.setGfx(this);
		textGfx.setText(text, textStyle);

		this.layers.hud.addChild(textGfx);
		textGfx.onDispose(function() {
			this.layers.hud.removeChild(textGfx);
		}.bind(this));

		return textGfx;
	}

	,
	enableTouchClicks: function() {
		createjs.Touch.enable(this.layers.hud);
	}
	,
	createHUDOverlay: function() {
		var hudOverlay = new EaselJSGraphics.HudGraphics.HudOverlay();
		this.layers.hud.addChild(hudOverlay);
		hudOverlay.onDispose(function() {
			this.layers.hud.removeChild(hudOverlay);
		}.bind(this));
		return hudOverlay;
	}
	,
	createPauseButtonHUD: function() {
		var pauseButton = new EaselJSGraphics.HudGraphics.HudPauseButton(this);
		this.layers.hud.addChild(pauseButton);
		pauseButton.onDispose(function() {
			this.layers.hud.removeChild(pauseButton);
		}.bind(this));
		return pauseButton;
	}
	,
	createMenuButton: function(text) {
		var buttonGfx = new EaselJSGraphics.MenuGraphics.MenuButton(this);
		buttonGfx.setText(text);
		buttonGfx.addButtonEvents = function(events) {
			if (events.invoke)
				this.addEventListener('click', events.invoke);
			if (events.hoverEnter)
				this.addEventListener('mouseover', events.hoverEnter);
			if (events.hoverLeave)
				this.addEventListener('mouseout', events.hoverLeave);
		};

		this.layers.hud.addChild(buttonGfx);
		buttonGfx.onDispose(function() {
			this.layers.hud.removeChild(buttonGfx);
		}.bind(this));

		return buttonGfx;
	}
	
	,
	createXQuestLogoGraphic: function() {
		var introGraphics = new EaselJSGraphics.XQuestLogoGraphic(this);
		this.layers.hud.addChild(introGraphics);
		introGraphics.onDispose(function() {
			this.layers.hud.removeChild(introGraphics);
		}.bind(this));
		
		return introGraphics;
	}
});
