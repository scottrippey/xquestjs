var ArcadeGame = Smart.Class(new BaseGame(), {
	player: null
	, levelGraphics: null
	, activePowerups: null
	, paused: false
	, stats: null
	, powerCrystals: null

	, initialize: function ArcadeGame(graphics) {
		// Since all other classes use 'this.game', this will provide consistency:
		this.game = this;

		this.initializeGame(graphics);
		this.addGameItem(this);

		this.stats = {};
		this._setupLevelGraphics();
		this._setupPlayer();
		this._setupEnemyFactory();
		this._setupCrystals();
		this._setupPowerCrystals();
		this._setupProjectiles();

		this.activePowerups = {};

		this._startGame();
	}
	, _setupLevelGraphics: function() {
		this.levelGraphics = this.game.gfx.createLevelGraphics();
	}
	, _setupPlayer: function() {
		this.player = new Player(this.game);
		this.game.addGameItem(this.player);
	}
	, _setupEnemyFactory: function() {
		this.enemies = new EnemyFactory(this.game);
		this.addGameItem(this.enemies);
	}
	, _setupCrystals: function() {
		this.crystals = new CrystalFactory(this.game);
	}
	, _setupPowerCrystals: function() {
		this.powerCrystals = new PowerupFactory(this.game);
	}
	, _setupProjectiles: function() {
		this.projectiles = new Projectiles(this.game);
	}
	
	, debug: function() {
		var debug = new GameDebugger(this.game);
		this.debug = function() { return debug; };
		return this.debug();
	}

	, _startGame: function() {
		this.currentLevel = 1;
		this.stats.lives = Balance.player.lives;
		this.stats.bombs = Balance.bombs.startCount;

		this._showLevelNumber();
		this._arrangeNewLevel();
		this._startLevel();
	}
	, _showLevelNumber: function() {
		var level = "Level " + this.currentLevel;

		var textGfx = this.game.gfx.addText(level, { textBaseline: 'top' });
		textGfx.flyIn(1.5).flyOut(2);
	}
	, _arrangeNewLevel: function() {
		this.game.levelGraphics.closeGate();
		this.game.levelGraphics.setGateWidth(Balance.level.gateWidth);

		this.game.crystals.clearCrystals();
		this.game.crystals.startLevel();
		this.game.enemies.startLevel();
		this.game.powerCrystals.startLevel();
	}
	, _startLevel: function() {
		var middleOfGame = this.game.gfx.getGamePoint('middle');
		this.game.player.movePlayerTo(middleOfGame.x, middleOfGame.y);
		this.game.player.cancelVelocity();
		this.game.player.showPlayer(true);

		this.followPlayer = true;
	}

	, onAct: function(tickEvent) {
		this._updateActivePowerups(tickEvent);

		if (this.followPlayer)
			this.game.gfx.followPlayer(this.game.player.location);

	}


	, killPlayer: function() {
		this.game.player.killPlayer();
		this.game.enemies.clearAllEnemies();
		this.game.powerCrystals.clearAllPowerCrystals();

		if (this.game.stats.lives === 0) {
			this._gameOver();
		} else {
			this._loseALife();
		}
	}
	, _loseALife: function() {
		this.game.stats.lives--;
		this._animateBackToCenter().queue(function() {
			this._startLevel();
		}.bind(this));
	}
	, _gameOver: function() {
		// bew wew wew wew wew
		this._animateBackToCenter();

		this.game.gfx.addAnimation(new Smart.Animation()
			.queue(function() {
				this.game.gfx.addText("Game Over").flyIn(2).delay(2).flyOut(2);
			}.bind(this)).delay(5)
			.queue(function() {
				this.game.gfx.addText("Highest Level: " + this.currentLevel).flyIn(2).delay(2).flyOut(2);
			}.bind(this)).delay(5)
			.queue(function() {
				this.game.gfx.addText("Starting a new game in 5 seconds...").flyIn(2).delay(2).flyOut(2);
			}.bind(this)).delay(5)
			.queue(function() {
				this._startGame();
			}.bind(this))
		);

	}

	, levelUp: function() {
		this.game.player.showPlayer(false);

		// Let's kill all enemies:
		this.game.enemies.killAllEnemies();
		this.game.powerCrystals.clearAllPowerCrystals();

		this.currentLevel++;

		this._showLevelNumber();
		this._arrangeNewLevel();
		this._animateBackToCenter().queue(function() {
			this._startLevel();
		}.bind(this));
	}
	, _animateBackToCenter: function() {
		var visibleMiddle = this.game.gfx.getGamePoint('visibleMiddle')
			, middleOfGame = this.game.gfx.getGamePoint('middle');

		this.followPlayer = false;
		var animation = new Smart.Animation()
			.duration(2).ease()
			.tween(function(p) {
				this.game.gfx.followPlayer(p);
			}.bind(this), Smart.Keyframes.fromPoints([ visibleMiddle, middleOfGame ]));
		this.game.gfx.addAnimation(animation);
		return animation;
	}

	, crystalsGathered: function(remainingCrystals, gatheredCrystals) {
		if (remainingCrystals === 0) {
			this.game.levelGraphics.openGate();
		}
	}

	, pauseGame: function(paused) {
		this.paused = (paused !== undefined) ? paused : !this.paused;
		this.timer.pauseTimer(this.paused);

		this.game.player.cancelVelocity();

		this.fireEvent('gamePaused', [ this.paused ]);
	}
	, onGamePaused: function(callback) {
		this.addEvent('gamePaused', callback);
	}

	, activatePowerup: function(powerupName) {
		this.game.activePowerups[powerupName] = 'newPowerup';

		var powerupDisplayName = powerupName + "!";
		var textGfx = this.game.gfx.addText(powerupDisplayName, 'powerupActive');
		textGfx.start('left').flyIn(1.5, 'middle').flyOut(2, 'right');
	}
	, powerupDeactivated: function(powerupName) {
		var powerupDisplayName = powerupName + " inactive";
		var textGfx = this.game.gfx.addText(powerupDisplayName, 'powerupDeactive');
		return textGfx.start('left').flyIn(1.5, 'middle').flyOut(2, 'right');
	}
	, _updateActivePowerups: function(tickEvent) {
		var B = Balance.powerups;
		var updatedValues = {};
		var deactivating = 'deactivating';
		
		// Update new and old powerups: (never make changes to an object while iterating)
		_.forOwn(this.game.activePowerups, function(powerupValue, powerupName) {
			if (powerupValue === 'newPowerup') {
				// New
				var powerupExpires = tickEvent.runTime + B[powerupName].duration * 1000;
				updatedValues[powerupName] = powerupExpires;
			} else if (powerupValue === deactivating) {
				// Old
			} else if (powerupValue <= tickEvent.runTime) {
				// Expired
				updatedValues[powerupName] = deactivating;
			}
		});
		_.forOwn(updatedValues, function(updatedValue, powerupName) {
			if (updatedValue === deactivating) {
				this.game.powerupDeactivated(powerupName).queue(function() {
					delete this.game.activePowerups[powerupName];
				}.bind(this));
			}
			this.game.activePowerups[powerupName] = updatedValue;
		}, this);

	}

});
