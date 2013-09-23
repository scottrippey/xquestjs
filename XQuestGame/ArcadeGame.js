var ArcadeGame = Class.create(new BaseGame(), {
	player: null
	, level: null

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
	_setupGameEvents: function() {
		this.events.onCrystalsGathered(function(crystalCount) {
			if (crystalCount === 0) {
				this.level.openGate();
			}
		}.bind(this));

	}

	,
	onAct: function(tickEvent) {
		this.gfx.followPlayer(this.player.location);
	}

});
