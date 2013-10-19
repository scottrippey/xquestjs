var BaseGame = Smart.Class(new Smart.Events(), {
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
		this.gameItemCounter = [];
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
		// Iterate right-to-left, because items could be removed
		_.forEachRight(this.handlers.input, function(gameItem) { gameItem.onInput(tickEvent); });
		_.forEachRight(this.handlers.move, function(gameItem) { gameItem.onMove(tickEvent); });
		_.forEachRight(this.handlers.act, function(gameItem) { gameItem.onAct(tickEvent); });
		_.forEachRight(this.handlers.draw, function(gameItem) { gameItem.onDraw(tickEvent); });
	}
	,
	addGameItem: function(gameItem) {
		// Determine which methods the gameItem implements,
		// and add them to the appropriate queue:
		if (gameItem.onInput)
			this.handlers.input.push(gameItem);
		if (gameItem.onMove)
			this.handlers.move.push(gameItem);
		if (gameItem.onAct)
			this.handlers.act.push(gameItem);
		if (gameItem.onDraw)
			this.handlers.draw.push(gameItem);

		this.gameItemCounter.push(gameItem);
		console.log("Game Item added: ", this.gameItemCounter.length, gameItem);
	}
	,
	removeGameItem: function(gameItem) {
		if (gameItem.onInput)
			_.eliminate(this.handlers.input, gameItem);
		if (gameItem.onMove)
			_.eliminate(this.handlers.move, gameItem);
		if (gameItem.onAct)
			_.eliminate(this.handlers.act, gameItem);
		if (gameItem.onDraw)
			_.eliminate(this.handlers.draw, gameItem);

		_.eliminate(this.gameItemCounter, gameItem);
		console.log("Game item removed: ", this.gameItemCounter.length, gameItem);
	}

});
