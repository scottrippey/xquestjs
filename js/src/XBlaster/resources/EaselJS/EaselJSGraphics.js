var EaselJSGraphics = new Class({

	variables: {
		backgroundColor: 'black'
	}
	, initialize: function(canvas) {
		this.canvas = canvas;
		this.stage = new createjs.Stage(canvas);

		this._setupBackground();
	}
	,
	_setupBackground: function() {
		var background = new createjs.Shape();
		background.graphics
			.beginFill(this.variables.backgroundColor)
			.drawRect(0, 0, this.canvas.width, this.canvas.height);

		this.addToStage(background);
	}
	,
	addToStage: function(displayObject) {
		Array.each(arguments, function(displayObject) {
			this.stage.addChild(displayObject);
		}, this);
	}
	,
	startTimer: function() {
		createjs.Ticker.addListener(this.stage);
	}
});