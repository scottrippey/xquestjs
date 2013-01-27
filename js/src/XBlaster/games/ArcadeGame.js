var ArcadeGame = new Class({

	gfx: null
	, input: null
	, initialize: function(gfx, input, timer) {
		this.gfx = gfx;
		this.input = input;
		this.timer = timer;

		this.handlers = {
			movable: []
			, actionable: []
			, drawable: []
		};

		this._setupEvents();

		this._startTimer();

	}
	, _setupEvents: function() {
		this.onDraw(this.gfx.draw.bind(this.gfx));
	}
	, _startTimer: function() {
		this.timer.onTick(this._onTick.bind(this));
	}
	, _onTick: function(tickEvent) {
		var game = this;

		this.handlers.movable.each(function(moveHandler) {
			moveHandler(tickEvent, game);
		});

		this.handlers.actionable.each(function(actHandler) {
			actHandler(tickEvent, game);
		});

		this.handlers.drawable.each(function(drawHandler) {
			drawHandler(tickEvent, game);
		});

	}

	, onMove: function(moveHandler) {
		this.handlers.movable.push(moveHandler);
	}
	, onAct: function(actHandler) {
		this.handlers.actionable.push(actHandler);
	}
	, onDraw: function(drawHandler) {
		this.handlers.drawable.push(drawHandler);
	}


});
