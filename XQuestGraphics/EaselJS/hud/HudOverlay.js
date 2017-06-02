Balance.onUpdate(function(mode) {
	_.merge(Graphics, {
		hudGraphics: {
			backgroundStyle: {
				fillStyle: 'hsla(0, 100%, 100%, 0.1)'
			}
		}
	});
});

EaselJSGraphics.HudGraphics.HudOverlay = Smart.Class(new EaselJSGraphics.Drawing(), {
	drawEffects(drawing) {
		var G = Graphics.hudGraphics, bounds = Balance.level.bounds;

		drawing.beginPath()
			.rect(0, 0, bounds.visibleWidth, bounds.hudHeight)
			.endPath(G.backgroundStyle);
	}
});