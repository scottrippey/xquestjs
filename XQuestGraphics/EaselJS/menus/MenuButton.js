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
	drawStatic: function(drawing) {
		var G = Graphics.menuButton;
		drawing.beginPath()
			.roundRect(0, 0, G.width, G.height, G.borderRadius)
			.endPath(G.buttonStyle);
	}
	,drawEffects: function(drawing) {

	}
});