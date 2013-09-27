var ArcadeGame = Class.create(new BaseGame(), {
	player: null
	, levelGraphics: null
	, powerups: null

	,
	initialize: function(canvas) {
		// Since all other classes use 'this.game', this will provide consistency:
		this.game = this;

		this.initializeGame(canvas);
		this.addGameItem(this);

		this._setupLevelGraphics();
		this._setupPlayer();
		this._setupEnemyFactory();
		this._setupCrystals();
		this._setupPowerups();

		this._startGame();
	}
	,
	_startGame: function() {
		this.currentLevel = 1;
		this._arrangeLevel();
		this._startLevel();
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
		this.crystals = new Crystals(this.game);
	}
	,
	_setupPowerups: function() {
		this.powerups = {
			bounceOffWalls: true // Temporary, until player can die
		};
	}

	,
	_arrangeLevel: function() {
		this.game.levelGraphics.closeGate();
		this.game.levelGraphics.setGateWidth(Balance.gate.startingWidth);

		this.game.crystals.createCrystals(Balance.crystals.quantity);
		this.game.enemies.setLevel(this.currentLevel);
	}
	,
	_startLevel: function() {
		var middleOfGame = this._getMiddleOfGame();
		this.game.player.moveTo(middleOfGame.x, middleOfGame.y);
		this.game.player.cancelVelocity();
		this.game.player.showPlayer(true);

		this.followPlayer = true;
	}
	,
	_getMiddleOfGame: function() {
		var bounds = Balance.level.bounds
			, middleOfGame = {
				x: bounds.x + (bounds.width / 2)
				,y: bounds.y + (bounds.height / 2)
			};
		return middleOfGame;
	}

	,
	onAct: function(tickEvent) {
		if (this.followPlayer)
			this.game.gfx.followPlayer(this.game.player.location);

	}


	,
	killPlayer: function() {
		this.player.killPlayerGraphics();
	}

	,
	levelUp: function() {
		this.game.player.showPlayer(false);

		// TEMP: for now, let's just kill all enemies:
		this.game.enemies.killEnemiesOnCollision([ { location: { x: 0, y: 0 }, radius: 999999 } ], 999999, null);

		this.currentLevel++;

		this._arrangeLevel();
		this._animateBackToCenter().queue(function() {
			this._startLevel();
		}.bind(this));
	}
	,
	_animateBackToCenter: function() {
		var visibleMiddle = this.game.gfx.getVisibleMiddle()
			, middleOfGame = this._getMiddleOfGame();

		this.followPlayer = false;
		var animation = new Animation()
			.duration(2).ease()
			.tween(function(p) {
				this.game.gfx.followPlayer(p);
			}.bind(this), Keyframes.fromPoints([ visibleMiddle, middleOfGame ]));
		this.game.gfx.addAnimation(animation);
		return animation;
	}

	,
	crystalsGathered: function(remainingCrystals, gatheredCrystals) {
		if (remainingCrystals === 0) {
			this.game.levelGraphics.openGate();
		}
	}

	});
