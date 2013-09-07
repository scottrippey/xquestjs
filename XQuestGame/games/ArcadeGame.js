var ArcadeGame = new Class({

	gfx: null
	, input: null
	, timer: null

	, initialize: function(gfx, input, timer) {
		this.gfx = gfx;
		this.input = input;
		this.timer = timer;

		this.handlers = {
			input: []
			, move: []
			, act: []
			, draw: []
		};

		this._setupEvents();
		this._startTimer();
		this._startGame();
	}
	, _setupEvents: function() {
		this.addGameItem(this.gfx);
	}
	, _startTimer: function() {
		this.timer.addTickHandler(this._tickHandler.bind(this));
	}
	, _tickHandler: function(tickEvent) {
		var executeHandlerWithTickEvent = function(handler) {
			handler(tickEvent);
		};

		this.handlers.input.each(executeHandlerWithTickEvent);
		this.handlers.move.each(executeHandlerWithTickEvent);
		this.handlers.act.each(executeHandlerWithTickEvent);
		this.handlers.draw.each(executeHandlerWithTickEvent);
	}

	, addGameItem: function(gameItem) {
		// Determine which methods the gameItem implements,
		// and add them to the appropriate queue:
		if (gameItem.onInput)
			this.handlers.input.push(gameItem.onInput.bind(gameItem));
		if (gameItem.onMove)
			this.handlers.move.push(gameItem.onMove.bind(gameItem));
		if (gameItem.onAct)
			this.handlers.act.push(gameItem.onAct.bind(gameItem));
		if (gameItem.onDraw)
			this.handlers.draw.push(gameItem.onDraw.bind(gameItem));
	}

	, _startGame: function() {
		var game = this;
		this.level = game.gfx.createLevelGraphics();
		this._createPlayer();
		this._createEnemyFactory();
		this._createCrystals();
	}
	, _createPlayer: function() {
		var game = this;
		game.player = new Player(game);
		var bounds = Balance.level.bounds, middleOfGame = {
			x:bounds.x + (bounds.width / 2)
			,y:bounds.y + (bounds.height / 2)
		};
		game.player.moveTo(middleOfGame.x, middleOfGame.y);
		this.addGameItem(game.player);
	}
	, _createEnemyFactory: function() {
		var game = this;
		game.enemies = new EnemyFactory(game);
		this.addGameItem(game.enemies);
	}
	, _createCrystals: function() {
		this.crystals = new Crystals(this);
		this.crystals.createCrystals(Balance.crystals.quantity);
	}

});