var ArcadeGame = Class.create(new BaseGame(), {
	player: null
	, levelGraphics: null
	, powerups: null
	, currentLevel: 0

	,
	initialize: function(canvas) {
		// Since all other classes use 'this.game', this will provide consistency:
		this.game = this;

		this.initializeGame(canvas);
		this.addGameItem(this);

		this._setupGameEvents();
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
		this._startLevel();
	}
	,
	_setupLevelGraphics: function() {
		this.game.levelGraphics = this.game.gfx.createLevelGraphics();
	}
	,
	_setupPlayer: function() {
		this.game.player = new Player(this.game);
		this.game.addGameItem(this.game.player);
	}
	,
	_setupEnemyFactory: function() {
		this.game.enemies = new EnemyFactory(this.game);
		this.addGameItem(this.game.enemies);
	}
	,
	_setupCrystals: function() {
		this.game.crystals = new Crystals(this.game);
	}
	,
	_setupPowerups: function() {
		this.game.powerups = {
			bounceOffWalls: true // Temporary, until player can die
		};
	}

	,
	_setupGameEvents: function() {
		this.game.events.onCrystalsGathered(function(crystalCount) {
			if (crystalCount === 0) {
				this.game.levelGraphics.openGate();
			}
		}.bind(this));
	}
	,
	_startLevel: function() {
		this.game.levelGraphics.closeGate();
		this.game.levelGraphics.setGateWidth(Balance.gate.startingWidth);

		this.game.crystals.createCrystals(Balance.crystals.quantity);
		this.game.enemies.setLevel(this.currentLevel);

		var bounds = Balance.level.bounds
			, middleOfGame = {
				x: bounds.x + (bounds.width / 2)
				,y: bounds.y + (bounds.height / 2)
			};
		this.game.player.moveTo(middleOfGame.x, middleOfGame.y);
		this.game.player.cancelVelocity();
	}

	,
	onAct: function(tickEvent) {
		this.game.gfx.followPlayer(this.game.player.location);
	}


	,
	killPlayer: function(reason) {
		this.player.killPlayerGraphics();
	}

	, levelUp: function() {
		// TEMP: for now, let's just kill all enemies:
		this.game.enemies.killEnemiesOnCollision([ { location: { x: 0, y: 0 }, radius: 999999 } ], 999999, null);

		this.currentLevel++;
		this._startLevel();
	}

});
