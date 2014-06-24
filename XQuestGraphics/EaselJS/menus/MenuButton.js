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
				segmentsH: 20, devH: 0.05, segmentsV: 5, devV: 0.5
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
		var textGfx = this.gfx.addText(text, 'menuButton');
		this.addChild(textGfx);

		textGfx.moveTo(this.visibleWidth / 2, this.visibleHeight / 2);
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
		var G = Graphics.menuButton;
		if (!this.shape || this.nextChange <= tickEvent.time) {
			var backgroundDrawing = this.shape = new EaselJSGraphics.DrawingQueue();
			this.nextChange = tickEvent.time + G.backgroundShape.changeFrequency;
			var left = 0, top = 0, right = left + G.width, bottom = top + G.height;
			
			var segmentsH = G.backgroundShape.segmentsH, devH = G.backgroundShape.devH;
			var segmentsV = G.backgroundShape.segmentsV, devV = G.backgroundShape.devV;
			
			backgroundDrawing.beginPath();
			backgroundDrawing.moveTo(left, top);
			EaselJSGraphics.SpecialEffects.drawElectricLineTo(backgroundDrawing, { x: left, y: top }, { x: right, y: top }, segmentsH, devH);
			EaselJSGraphics.SpecialEffects.drawElectricLineTo(backgroundDrawing, { x: right, y: top }, { x: right, y: bottom }, segmentsV, devV);
			EaselJSGraphics.SpecialEffects.drawElectricLineTo(backgroundDrawing, { x: right, y: bottom }, { x: left, y: bottom }, segmentsH, devH);
			EaselJSGraphics.SpecialEffects.drawElectricLineTo(backgroundDrawing, { x: left, y: bottom }, { x: left, y: top }, segmentsV, devV);
			backgroundDrawing.endPath(this.isActive ? G.buttonActiveStyle : G.buttonStyle);
		}
		drawing.drawingQueue(this.shape);
	}
});