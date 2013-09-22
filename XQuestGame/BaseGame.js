var BaseGame = new Class({
	gfx: null
	, input: null
	, timer: null

	,
	initializeGame: function(canvas) {
		if (!canvas)
			console.error("You must provide a Canvas element!");

		this._setupHandlers();
		this._setupGraphics(canvas);
		this._setupInput();
		this._setupTimer();
	}
	,
	_setupHandlers: function() {
		this.handlers = {
			input: []
			, move: []
			, act: []
			, draw: []
		};
	}
	,
	_setupGraphics: function(canvas) {
		this.gfx = new EaselJSGraphics(canvas);
		this.addGameItem(this.gfx);
	}
	,
	_setupInput: function() {
		this.input = new GameInput();
	}
	,
	_setupTimer: function() {
		this.timer = new EaselJSTimer();
		this.timer.addTickHandler(this._tickHandler.bind(this));
	}
	,
	_tickHandler: function(tickEvent) {
		var executeHandlerWithTickEvent = function(handler) {
			handler(tickEvent);
		};

		_.each(this.handlers.input, executeHandlerWithTickEvent);
		_.each(this.handlers.move, executeHandlerWithTickEvent);
		_.each(this.handlers.act, executeHandlerWithTickEvent);
		_.each(this.handlers.draw, executeHandlerWithTickEvent);
	}
	,
	addGameItem: function(gameItem) {
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

});
