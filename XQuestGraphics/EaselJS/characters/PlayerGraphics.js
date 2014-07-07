EaselJSGraphics.PlayerGraphics = Smart.Class(new EaselJSGraphics.Drawing(), {
	drawStatic: function(drawing) {
		var G = Graphics.player;
		this.radius = G.radius;

		drawing.beginPath()
			.circle(0, 0, G.radius)
			.endPath(G.outerStrokeStyle);

		drawing.beginPath()
			.star(0, 0, G.innerRadius, G.innerStarPoints, G.innerStarSize, 0)
			.endPath(G.innerStyle);

	}
	,drawEffects: function(drawing, tickEvent){
		var G = Graphics.player;

		this.rotation += (G.spinRate * tickEvent.deltaSeconds);
	}
	,killPlayerGraphics: function(gfx, velocity) {
		var G = Graphics.player;
		this.toggleVisible(false);
		gfx.createExplosion(this, velocity, G.explosionOptions);
	}
	,restorePlayerGraphics: function() {
		this.toggleVisible(true);
	}
});
