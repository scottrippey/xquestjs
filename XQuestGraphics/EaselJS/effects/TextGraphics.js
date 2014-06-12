EaselJSGraphics.TextGraphic = Smart.Class(new createjs.Text(), {
	textStyles: {
		default: {
			fontWeight: 'normal'
			, fontSize: '48px'
			, fontFamily: '"Segoe UI"'
			, color: 'white'
			, textAlign: 'center'
			, textBaseline: 'middle'
		}
		,
		powerupActive: {
			fontSize: '30px'
			, color: 'hsl(120, 100%, 80%)'
			, textBaseline: 'bottom'
		}
		,
		powerupDeactive: {
			fontSize: '24px'
			, color: 'hsl(0, 100%, 80%)'
			, textBaseline: 'bottom'
		}
		,
		hudText: {
			fontSize: '12px'
			, color: 'white'
			, textBaseline: 'middle'
			, textAlign: 'left'
		}
	}
	,
	setGfx: function(gfx) {
		this.gfx = gfx;
		this.animation = gfx.addAnimation(new Smart.Animation());
		this.start('top');
	}
	,
	setText: function(text, textStyle) {

		this.text = text;

		if (typeof textStyle === 'string') {
			textStyle = this.textStyles[textStyle];
		}

		textStyle = textStyle ? _.defaults({}, textStyle, this.textStyles.default) : this.textStyles.default;
		this.font = [ textStyle.fontWeight, textStyle.fontSize, textStyle.fontFamily ].join(" ");
		this.color = textStyle.color;

		this.textAlign = textStyle.textAlign;
		this.textBaseline = textStyle.textBaseline;
	}
	,
	start: function(gamePoint) {
		var location = this.gfx.getHudPoint(gamePoint);
		this.moveTo(location.x, location.y);
		return this;
	}
	,
	flyIn: function(duration, to) {
		var toLocation = this.gfx.getHudPoint(to || 'middle');

		var txt = this;
		this.animation
			.duration(duration)
			.easeOut()
			.fade(txt, [0, 1])
			.move(txt, toLocation)
			.rotate(txt, [30, 0])
			.queue()
			.update(0)
		;

		return this;
	}
	,
	flyOut: function(duration, to) {
		var toLocation = this.gfx.getHudPoint(to || 'bottom');

		var txt = this;
		this.animation
			.duration(duration)
			.easeIn()
			.fade(txt, [1, 0])
			.move(txt, toLocation )
			.rotate(txt, [0, 30])
			.queueDispose(txt)
		;

		return this;
	}
	,
	queue: function(callback) {
		this.animation.queue(callback);
		return this;
	}
	,
	delay: function(duration) {
		this.animation.delay(duration);

		return this;
	}
	
});
