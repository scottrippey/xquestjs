Balance.onUpdate(function(mode) {
	_.merge(Graphics, {
		HUD: {
			backgroundStyle: {
				fillColor: 'hsla(0, 100%, 100%, 0.1)'
			}
		}
	});
});

EaselJSGraphics.HUDOverlay = Smart.Class(new createjs.Shape(), {
	initialize: function() {
		this._setupGraphics();
	}
	, _setupGraphics: function() {
		var G = Graphics.HUD, bounds = Balance.level.bounds;

		this.graphics.clear()
			.beginStyle(G.backgroundStyle)
			.drawRect(0, 0, bounds.visibleWidth, bounds.hudHeight)
			.endStyle(G.backgroundStyle)
		;

	}
});