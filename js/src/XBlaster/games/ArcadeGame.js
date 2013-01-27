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
		this.onDraw(this.gfx.draw.bind(this.gfx));
	}
	, _startTimer: function() {
		this.timer.onTick(this._onTick.bind(this));
	}
	, _onTick: function(tickEvent) {
		var game = this;

		this.handlers.input.each(function(moveHandler) {
			moveHandler(tickEvent, game);
		});

		this.handlers.move.each(function(moveHandler) {
			moveHandler(tickEvent, game);
		});

		this.handlers.act.each(function(actHandler) {
			actHandler(tickEvent, game);
		});

		this.handlers.draw.each(function(drawHandler) {
			drawHandler(tickEvent, game);
		});

	}

	, onInput: function(inputHandler) {
		this.handlers.input.push(inputHandler);
	}
	, onMove: function(moveHandler) {
		this.handlers.move.push(moveHandler);
	}
	, onAct: function(actHandler) {
		this.handlers.act.push(actHandler);
	}
	, onDraw: function(drawHandler) {
		this.handlers.draw.push(drawHandler);
	}


	, _startGame: function() {
		var game = this;
		var player = new Player(game);

		this.onInput(player.input.bind(player));
		this.onMove(player.move.bind(player));
		this.onAct(player.act.bind(player));

	}

});
