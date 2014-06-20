Balance.onUpdate(function(gameMode) {
	Graphics.merge({
		menuButton: {
			width: 400
			,height: 40
			,borderRadius: 6
			,buttonStyle: {
				strokeWidth: 1,
				strokeColor: 'hsla(0, 100%, 100%, 0.7',
				fillColor: 'hsla(0, 100%, 100%, 0.2'
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
	}
	,setText: function(text) {
		var textGfx = this.gfx.addText(text, 'menuButton');
		this.addChild(textGfx);
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