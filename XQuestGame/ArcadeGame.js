var ArcadeGame = Class.create(new BaseGame(), {
	player: null
	, level: null
	, powerups: null

	,
	initialize: function(canvas) {
		this.initializeGame(canvas);

		this.addGameItem(this);
		this._startGame();
	}
	,
	_startGame: function() {
		var game = this;
		this.level = game.gfx.createLevelGraphics();
		this.level.setGateWidth(Balance.gate.startingWidth);

		this._createPlayer();
		this._createEnemyFactory();
		this._createCrystals();
		this._setupGameEvents();
		this._setupPowerups();
	}
	,
	_createPlayer: function() {
		var game = this;
		game.player = new Player(game);
		var bounds = Balance.level.bounds, middleOfGame = {
			x:bounds.x + (bounds.width / 2)
			,y:bounds.y + (bounds.height / 2)
		};
		game.player.moveTo(middleOfGame.x, middleOfGame.y);
		this.addGameItem(game.player);
	}
	,
	_createEnemyFactory: function() {
		var game = this;
		game.enemies = new EnemyFactory(game);
		this.addGameItem(game.enemies);
	}
	,
	_createCrystals: function() {
		this.crystals = new Crystals(this);
		this.crystals.createCrystals(Balance.crystals.quantity);

	}
	,
	_setupPowerups: function() {
		this.powerups = {
			bounceOffWalls: true // Temporary, until player can die
		};
	}

	,
	_setupGameEvents: function() {
		this.events.onCrystalsGathered(function(crystalCount) {
			if (crystalCount === 0) {
				this.level.openGate();
			}
		}.bind(this));
		this.events.onLevelUp(this._levelUp.bind(this));

	}
	,
	_levelUp: function() {

		// TEMP: for now, let's just kill all enemies:
		this.enemies.killEnemiesOnCollision([ { location: { x: 0, y: 0 }, radius: 999999 } ], 999999, null);

		this.level.closeGate();

		this.crystals.createCrystals(Balance.crystals.quantity);
	}

	,
	onAct: function(tickEvent) {
		this.gfx.followPlayer(this.player.location);
	}

});
