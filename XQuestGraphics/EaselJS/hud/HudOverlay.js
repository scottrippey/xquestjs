Balance.onUpdate(function(mode) {
	_.merge(Graphics, {
		hudGraphics: {
			backgroundStyle: {
				fillColor: 'hsla(0, 100%, 100%, 0.1)'
			}
		}
	});
});

EaselJSGraphics.HudGraphics.HudOverlay = Smart.Class(new createjs.Shape(), {
	initialize: function() {
		this._setupGraphics();
	}
	, _setupGraphics: function() {
		var G = Graphics.hudGraphics, bounds = Balance.level.bounds;

		this.graphics.clear()
			.beginStyle(G.backgroundStyle)
			.drawRect(0, 0, bounds.visibleWidth, bounds.hudHeight)
			.endStyle(G.backgroundStyle)
		;

	}
});