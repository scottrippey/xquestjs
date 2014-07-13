Balance.onUpdate(function(gameMode) {
	Graphics.merge({
		menuButton: {
			width: 300
			,height: 60
			,borderRadius: 6
			,buttonStyle: {
				lineWidth: 3,
				strokeStyle: 'hsla(60, 100%, 100%, 0.3)',
				fillStyle: 'hsla(60, 100%, 100%, 0.2)'
			}
			,buttonActiveStyle: {
				lineWidth: 4,
				strokeStyle: 'hsla(60, 100%, 100%, 0.7)',
				fillStyle: 'hsla(60, 100%, 100%, 0.5)'
			}
			,backgroundShape: {
				changeFrequency: 1000 / 30,
				segmentsH: 20, deviationH: 0.05,
				segmentsV: 5, deviationV: 0.5
			}
		}
	});
});
EaselJSGraphics.MenuGraphics.MenuButton = Smart.Class(new createjs.Container(), {
	Container_initialize: createjs.Container.prototype.initialize
	,initialize: function(gfx) {
		this.Container_initialize();
		this.gfx = gfx;

		this.background = new EaselJSGraphics.MenuGraphics.MenuButtonBackground();
		this.addChild(this.background);

		var G = Graphics.menuButton;
		this.visibleWidth = G.width;
		this.visibleHeight = G.height;
		this.regX = G.width / 2;
		this.regY = G.height / 2;
	}
	,setText: function(text) {
		if (this.textGfx) {
			this.textGfx.text = text;
			return;
		}
		this.textGfx = this.gfx.addText(text, 'menuButton');
		this.addChild(this.textGfx);

		this.textGfx.moveTo(this.visibleWidth / 2, this.visibleHeight / 2);
	}
	,setActive: function(isActive) {
		if (this.isActive === isActive) return;
		this.isActive = isActive;
		this.background.isActive = isActive;
	}
});
EaselJSGraphics.MenuGraphics.MenuButtonBackground = Smart.Class(new EaselJSGraphics.Drawing(), {
	isActive: false
	,drawEffects: function(drawing, tickEvent) {
		if (!this.shape || this.nextChange <= tickEvent.time) {
			var G = Graphics.menuButton;
			var backgroundShape = this.shape = new Smart.DrawingQueue();
			this.nextChange = tickEvent.time + G.backgroundShape.changeFrequency;
			
			backgroundShape.beginPath();
			EaselJSGraphics.SpecialEffects.drawElectricRectangle(backgroundShape, G, G.backgroundShape);
			backgroundShape.endPath(this.isActive ? G.buttonActiveStyle : G.buttonStyle);
		}
		drawing.drawingQueue(this.shape);
	}
});