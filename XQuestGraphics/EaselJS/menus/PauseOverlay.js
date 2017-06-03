Balance.onUpdate(gameMode => {
	Graphics.merge({
		pauseOverlay: {
			style: {
				fillStyle: 'hsla(0, 0%, 0%, 0.8)'
			},
			fadeInDuration: 1
		}
	});
});
EaselJSGraphics.PauseOverlay = Smart.Class(new EaselJSGraphics.Drawing(), {
	setup(gfx) {
		this.gfx = gfx;
	},
	drawStatic(drawing) {
		var bounds = Balance.level.bounds, G = Graphics.pauseOverlay;
		drawing.beginPath().rect(0, 0, bounds.visibleWidth, bounds.visibleHeight).endPath(G.style);
	},
	showPauseOverlay() {
		var G = Graphics.pauseOverlay;
		this.gfx.addAnimation().duration(G.fadeInDuration).easeOut().fade(this, [0, 1]);
	}
});
