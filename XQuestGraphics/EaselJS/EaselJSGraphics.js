var EaselJSGraphics = Smart.Class({
	initialize(canvas) {
		this.canvas = canvas;

		this.debugStats = {
			allGraphics: []
		};

		this._setupLayers();
		this._setupAnimations();
	},

	_setupLayers() {
		this.layers = {
			background: new createjs.Stage(this.canvas),
			objects: new createjs.Stage(this.canvas),
			characters: new createjs.Stage(this.canvas),
			hud: new createjs.Stage(this.canvas)
		};

		var allGraphics = this.debugStats.allGraphics;
		function trackChildren(stage) {
            var addChild = stage.addChild;
            var removeChild = stage.removeChild;
            stage.addChild = function(child) {
				addChild.apply(this, arguments);
				allGraphics.push(child);
			};
            stage.removeChild = function(child) {
				removeChild.apply(this, arguments);
				_.eliminate(allGraphics, child);
			};
        }
		_.forOwn(this.layers, stage => {
			trackChildren(stage);
			stage.autoClear = false;
		});
		this.layers.hud.enableMouseOver();
	},

	showBackgroundStars(visible) {
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
	},

	_setupAnimations() {
		this.animations = new Smart.Animations();
	},

	/** Creates a clone */
	createNewGraphics() {
		return new EaselJSGraphics(this.canvas);
	},

	onMove(tickEvent) {
		this.animations.update(tickEvent.deltaSeconds);
	},

	onDraw(tickEvent) {
		this.layers.background.update(tickEvent);
		this.layers.objects.update(tickEvent);
		this.layers.characters.update(tickEvent);
		this.layers.hud.update(tickEvent);
	},

	followPlayer(playerLocation) {

		var bounds = Balance.level.bounds;

		if (!this._maxOffset) {
			this._maxOffset = {
				x: bounds.totalWidth - bounds.visibleWidth,
				y: bounds.totalHeight - bounds.visibleHeight
			};
		}

		this._offset = {
			x: Math.min(Math.max(0, playerLocation.x - bounds.visibleWidth/2), this._maxOffset.x),
			y: Math.min(Math.max(0, playerLocation.y - bounds.visibleHeight/2), this._maxOffset.y)
		};

		this.layers.background.x = -this._offset.x;
		this.layers.objects.x = -this._offset.x;
		this.layers.characters.x = -this._offset.x;

		this.layers.background.y = -this._offset.y;
		this.layers.objects.y = -this._offset.y;
		this.layers.characters.y = -this._offset.y;

	},

	getSafeSpawn(radius) {
        var leftEnemySpawn = this.getGamePoint('left');
        var rightEnemySpawn = this.getGamePoint('right');
        var safeDistance = Balance.enemies.safeSpawnDistance;
        var randomSpot;
        var isSafe;
        do {
			randomSpot = this.getGamePoint('random', radius);
			isSafe = !(Smart.Point.distanceTest(leftEnemySpawn, randomSpot, safeDistance)) && !(Smart.Point.distanceTest(rightEnemySpawn, randomSpot, safeDistance));
		} while (!isSafe);
        return randomSpot;
    },

	getGamePoint(gamePoint, radius) {
		if (typeof gamePoint !== 'string') return gamePoint;
		if (radius == undefined) radius = 0;
		var bounds = Balance.level.bounds;
		switch (gamePoint) {
			case 'random':
				return {
					x: bounds.x + radius + (bounds.width - radius - radius) * Math.random(),
					y: bounds.y + radius + (bounds.height - radius - radius) * Math.random()
				};
			case 'visibleMiddle':
				return {
					x: this._offset.x + bounds.visibleWidth / 2,
					y: this._offset.y + bounds.visibleHeight / 2
				};
			case 'middle':
				return {
					x: bounds.x + bounds.width / 2,
					y: bounds.y + bounds.height / 2
				};
			case 'top':
				return {
					x: bounds.x + bounds.width / 2,
					y: bounds.y + radius
				};
			case 'bottom':
				return {
					x: bounds.x + bounds.width / 2,
					y: bounds.y + bounds.height - radius
				};
			case 'left':
				return {
					x: bounds.x + radius,
					y: bounds.y + bounds.height / 2
				};
			case 'right':
				return {
					x: bounds.x + bounds.width - radius,
					y: bounds.y + bounds.height / 2
				};
			default:
				throw new Error(`Invalid gamePoint: ${gamePoint}`);
		}
	},

	getHudPoint(hudPoint) {
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
	},

	createLevelGraphics() {
		var levelGraphics = new EaselJSGraphics.LevelGraphics();
		this.layers.background.addChild(levelGraphics);
		levelGraphics.onDispose(() => {
			this.layers.background.removeChild(levelGraphics);
		});
		return levelGraphics;
	},

	createPlayerGraphics() {
		var playerGraphics = new EaselJSGraphics.PlayerGraphics();
		this.layers.characters.addChild(playerGraphics);
		return playerGraphics;
	},

	createPlayerHUDIcon() {
		var playerGraphics = new EaselJSGraphics.PlayerGraphics();
		var scale = 0.7;
		playerGraphics.scaleTo(scale);
		playerGraphics.visibleRadius *= scale;
		this.layers.hud.addChild(playerGraphics);
		return playerGraphics;
	},

	createBulletsGraphics() {
		var bulletsGraphics = new EaselJSGraphics.BulletsGraphics();
		this.layers.objects.addChild(bulletsGraphics);
		bulletsGraphics.onDispose(function() {
			this.layers.objects.removeChild(bulletsGraphics);
		});
		return bulletsGraphics;
	},

	createEnemyGraphics(enemyName) {
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
			throw new Error(`Unknown enemy: ${enemyName}`);

		this.layers.characters.addChild(enemyGraphics);
		enemyGraphics.onDispose(() => {
			this.layers.characters.removeChild(enemyGraphics);
		});

		return enemyGraphics;
	},

	createCrystalGraphic() {
		var crystal = new EaselJSGraphics.CrystalGraphic();
		this.layers.objects.addChild(crystal);
		crystal.onDispose(() => {
			this.layers.objects.removeChild(crystal);
		});
		return crystal;
	},

	createCrystalHUDIcon() {
		var crystal = new EaselJSGraphics.CrystalGraphic();
		var scale = 0.7;
		crystal.scaleTo(scale);
		crystal.visibleRadius *= scale;
		this.layers.hud.addChild(crystal);
		return crystal;
	},

	createPowerCrystalGraphic() {
		var powerCrystal = new EaselJSGraphics.PowerCrystalGraphic();
		this.layers.characters.addChild(powerCrystal);
		powerCrystal.onDispose(() => {
			this.layers.characters.removeChild(powerCrystal);
		});
		return powerCrystal;
	},

	createBombCrystalGraphic() {
		var bombCrystal = new EaselJSGraphics.BombCrystalGraphic();
		this.layers.objects.addChild(bombCrystal);
		bombCrystal.onDispose(() => {
			this.layers.objects.removeChild(bombCrystal);
		});
		return bombCrystal;
	},

	createBombCrystalHUDIcon() {
		var bombCrystal = new EaselJSGraphics.BombCrystalGraphic();
		var scale = 0.7;
		bombCrystal.scaleTo(scale);
		bombCrystal.visibleRadius *= scale;
		this.layers.hud.addChild(bombCrystal);
		bombCrystal.onDispose(() => {
			this.layers.hud.removeChild(bombCrystal);
		});
		return bombCrystal;
	},

	createBombGraphic() {
		var bomb = new EaselJSGraphics.BombGraphic();
		this.layers.objects.addChild(bomb);
		bomb.onDispose(() => {
			this.layers.objects.removeChild(bomb);
		});
		return bomb;
	},

	createExplosion(position, velocity, explosionOptions) {
		var explosion = new EaselJSGraphics.ExplosionGraphic(position, velocity, explosionOptions);
		this.layers.objects.addChild(explosion);
		explosion.onDispose(() => {
			this.layers.objects.removeChild(explosion);
		});
	},

	addAnimation(animation) {
		return this.animations.addAnimation(animation);
	},


	addText(text, textStyle) {
		var textGfx = new EaselJSGraphics.TextGraphic();
		textGfx.setGfx(this);
		textGfx.setText(text, textStyle);

		this.layers.hud.addChild(textGfx);
		textGfx.onDispose(() => {
			this.layers.hud.removeChild(textGfx);
		});

		return textGfx;
	},


	enableTouchClicks() {
		createjs.Touch.enable(this.layers.hud);
	},

	createHUDOverlay() {
		var hudOverlay = new EaselJSGraphics.HudGraphics.HudOverlay();
		this.layers.hud.addChild(hudOverlay);
		hudOverlay.onDispose(() => {
			this.layers.hud.removeChild(hudOverlay);
		});
		return hudOverlay;
	},

	createPauseButtonHUD() {
		var pauseButton = new EaselJSGraphics.HudGraphics.HudPauseButton(this);
		this.layers.hud.addChild(pauseButton);
		pauseButton.onDispose(() => {
			this.layers.hud.removeChild(pauseButton);
		});
		return pauseButton;
	},

	createPauseOverlay() {
		var pauseOverlay = new EaselJSGraphics.PauseOverlay(this);
		this.layers.background.addChild(pauseOverlay);
		pauseOverlay.onDispose(() => {
			this.layers.background.removeChild(pauseOverlay);
		});
		return pauseOverlay;
	},

	createMenuButton(text) {
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
		buttonGfx.onDispose(() => {
			this.layers.hud.removeChild(buttonGfx);
		});

		return buttonGfx;
	},


	createXQuestLogoGraphic() {
		var introGraphics = new EaselJSGraphics.XQuestLogoGraphic(this);
		this.layers.hud.addChild(introGraphics);
		introGraphics.onDispose(() => {
			this.layers.hud.removeChild(introGraphics);
		});

		return introGraphics;
	}
});
