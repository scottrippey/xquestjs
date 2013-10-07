EaselJSGraphics.TextGraphic = Smart.Class(new createjs.Text(), {
	defaultTextStyle: {
		fontWeight: 'normal'
		, fontSize: '48px'
		, fontFamily: '"Segoe UI"'
		, color: 'white'
		, textAlign: 'center'
		, textBaseline: 'middle'
	}
	,
	setGfx: function(gfx) {
		this.gfx = gfx;
		this.animation = gfx.addAnimation(new Smart.Animation());
	}
	,
	setText: function TextGraphics(text, textStyle) {

		this.text = text;

		textStyle = textStyle ? _.extend(textStyle, this.defaultTextStyle) : this.defaultTextStyle;
		this.font = [ textStyle.fontWeight, textStyle.fontSize, textStyle.fontFamily ].join(" ");
		this.color = textStyle.color;

		this.textAlign = textStyle.textAlign;
		this.textBaseline = textStyle.textBaseline;
	}
	,
	flyIn: function(duration) {
		var middleOfGame = this.gfx.getMiddleOfGame()
			, topOfGame = this.gfx.getTopOfGame();
		var txt = this;

		this.animation
			.duration(duration)
			.easeOut()
			.fade(txt, [0, 1])
			.move(txt, [ topOfGame, middleOfGame ])
			.rotate(txt, [30, 0])
			.queue()
			.update(0)
		;

		return this;
	}
	,
	flyOut: function(duration) {
		var txt = this;
		var middleOfGame = this.gfx.getMiddleOfGame()
			, bottomOfGame = this.gfx.getBottomOfGame();
		this.animation
			.duration(duration)
			.easeIn()
			.fade(txt, [1, 0])
			.move(txt, [ middleOfGame, bottomOfGame ])
			.rotate(txt, [0, 30])
			.queue(function(){
				txt.destroy();
			})
		;

		return this;
	}
	,
	delay: function(duration) {
		this.animation.delay(duration);

		return this;
	}

});
