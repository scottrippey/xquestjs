EaselJSGraphics.BaseEnemyGraphics = Smart.Class(new EaselJSGraphics.Drawing(), {
	drawCircleCircle(drawing, G) {
		var outerRadius = G.outerRadius;
		var outerStyle = G.outerStyle;
		var innerRadius = G.innerRadius;
		var innerStyle = G.innerStyle;

		drawing
			.beginPath()
			.circle(0, 0, outerRadius)
			.endPath(outerStyle)

			.beginPath()
			.circle(0, 0, innerRadius)
			.endPath(innerStyle)
		;
	},
	drawTriangleTriangle(drawing, G) {
		var outerTriangle = G.outerTriangle;
		var outerStyle = G.outerStyle;
		var innerTriangle = G.innerTriangle;
		var innerStyle = G.innerStyle;

		drawing
			.beginPath()
			.polygon(outerTriangle)
			.closePath()
			.endPath(outerStyle)

			.beginPath()
			.polygon(innerTriangle)
			.closePath()
			.endPath(innerStyle)
		;
	},
	killEnemy(gfx, velocity) {
		var enemyGraphics = this;
		enemyGraphics.dispose();

		var explosionOptions = this.getExplosionOptions();
		gfx.createExplosion(enemyGraphics, velocity, explosionOptions);
	}
});
