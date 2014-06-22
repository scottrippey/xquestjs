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
		}
	});
});
EaselJSGraphics.MenuGraphics.MenuButton = Smart.Class(new createjs.Container(), {
	Container_initialize: createjs.Container.prototype.initialize
	,initialize: function(gfx) {
		this.Container_initialize();
		this.gfx = gfx;

		this.addChild(new EaselJSGraphics.MenuGraphics.MenuButtonBackground());

		var G = Graphics.menuButton;
		this.visibleWidth = G.width;
		this.visibleHeight = G.height;
	}
	,setText: function(text) {
		var textGfx = this.gfx.addText(text, 'menuButton');
		this.addChild(textGfx);

		textGfx.moveTo(this.visibleWidth / 2, this.visibleHeight / 2);
	}
});
EaselJSGraphics.MenuGraphics.MenuButtonBackground = Smart.Class(new EaselJSGraphics.Drawing(), {
	drawEffects: function(drawing) {
		var G = Graphics.menuButton;
		var left = 0, top = 0, right = left + G.width, bottom = top + G.height;
		var segmentsH = 20, devH = 0.05;
		var segmentsV = 5, devV = 0.5;
		drawing.beginPath();
		drawing.moveTo(left, top);
		EaselJSGraphics.SpecialEffects.drawElectricLineTo(drawing, { x: left, y: top }, { x: right, y: top }, segmentsH, devH);
		EaselJSGraphics.SpecialEffects.drawElectricLineTo(drawing, { x: right, y: top }, { x: right, y: bottom }, segmentsV, devV);
		EaselJSGraphics.SpecialEffects.drawElectricLineTo(drawing, { x: right, y: bottom }, { x: left, y: bottom }, segmentsH, devH);
		EaselJSGraphics.SpecialEffects.drawElectricLineTo(drawing, { x: left, y: bottom }, { x: left, y: top }, segmentsV, devV);
		drawing.endPath(G.buttonStyle);
	}
});