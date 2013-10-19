var ArcadeGame = Smart.Class(new BaseGame(), {
	player: null
	, levelGraphics: null
	, activePowerups: null
	, paused: false
	, stats: null
	, powerCrystals: null

	,
	initialize: function ArcadeGame(canvas) {
		// Since all other classes use 'this.game', this will provide consistency:
		this.game = this;

		this.initializeGame(canvas);
		this.addGameItem(this);

		this.stats = {};
		this._setupLevelGraphics();
		this._setupPlayer();
		this._setupEnemyFactory();
		this._setupCrystals();
		this._setupPowerCrystals();
		this.activePowerups = {};

		this._startGame();
	}
	,
	_setupLevelGraphics: function() {
		this.levelGraphics = this.game.gfx.createLevelGraphics();
	}
	,
	_setupPlayer: function() {
		this.player = new Player(this.game);
		this.game.addGameItem(this.player);
	}
	,
	_setupEnemyFactory: function() {
		this.enemies = new EnemyFactory(this.game);
		this.addGameItem(this.enemies);
	}
	,
	_setupCrystals: function() {
		this.crystals = new CrystalFactory(this.game);
	}
	,
	_setupPowerCrystals: function() {
		this.powerCrystals = new PowerupFactory(this.game);
	}
	,
	debug: function() {
		var debug = new GameDebugger(this.game);
		this.debug = function() { return debug; };
		return this.debug();
	}

	,
	_startGame: function() {
		this.currentLevel = 1;
		this.stats.lives = Balance.player.lives;

		this._showLevelNumber();
		this._arrangeNewLevel();
		this._startLevel();
	}
	,
	_showLevelNumber: function() {
		var level = "Level " + this.currentLevel;

		var textGfx = this.game.gfx.addText(level, { textBaseline: 'top' });
		textGfx.flyIn(1.5).flyOut(2);
	}
	,
	_arrangeNewLevel: function() {
		this.game.levelGraphics.closeGate();
		this.game.levelGraphics.setGateWidth(Balance.level.gateWidth);

		this.game.crystals.clearCrystals();
		this.game.crystals.createCrystals(Balance.crystals.quantity);
		this.game.enemies.setLevel(this.currentLevel);
	}
	,
	_startLevel: function() {
		var middleOfGame = this.game.gfx.getMiddleOfGame();
		this.game.player.moveTo(middleOfGame.x, middleOfGame.y);
		this.game.player.cancelVelocity();
		this.game.player.showPlayer(true);

		this.followPlayer = true;
	}

	,
	onAct: function(tickEvent) {
		if (this.followPlayer)
			this.game.gfx.followPlayer(this.game.player.location);

	}


	,
	killPlayer: function() {
		this.game.player.killPlayer();
		this.game.enemies.clearAllEnemies();

		if (this.game.stats.lives === 0) {
			this._gameOver();
		} else {
			this._loseALife();
		}
	}
	,
	_loseALife: function() {
		this.game.stats.lives--;
		this._animateBackToCenter().queue(function() {
			this._startLevel();
		}.bind(this));
	}
	,
	_gameOver: function() {
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

	,
	levelUp: function() {
		this.game.player.showPlayer(false);

		// Let's kill all enemies:
		this.game.enemies.killAllEnemies();

		this.currentLevel++;

		this._showLevelNumber();
		this._arrangeNewLevel();
		this._animateBackToCenter().queue(function() {
			this._startLevel();
		}.bind(this));
	}
	,
	_animateBackToCenter: function() {
		var visibleMiddle = this.game.gfx.getVisibleMiddle()
			, middleOfGame = this.game.gfx.getMiddleOfGame();

		this.followPlayer = false;
		var animation = new Smart.Animation()
			.duration(2).ease()
			.tween(function(p) {
				this.game.gfx.followPlayer(p);
			}.bind(this), Smart.Keyframes.fromPoints([ visibleMiddle, middleOfGame ]));
		this.game.gfx.addAnimation(animation);
		return animation;
	}

	,
	crystalsGathered: function(remainingCrystals, gatheredCrystals) {
		if (remainingCrystals === 0) {
			this.game.levelGraphics.openGate();
		}
	}

	,
	pauseGame: function(paused) {
		this.paused = (paused !== undefined) ? paused : !this.paused;
		this.timer.pauseTimer(this.paused);

		this.game.player.cancelVelocity();
	}

	,
	activatePowerup: function(powerupName) {
		this.game.activePowerups[powerupName] = true;
	}
});
