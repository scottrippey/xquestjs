EaselJSGraphics.BaseEnemyGraphics = Smart.Class(new EaselJSGraphics.Drawing(), {
	drawCircleCircle: function(drawing, G) {
		var outerRadius = G.outerRadius,
			outerStyle = G.outerStyle,
			innerRadius = G.innerRadius,
			innerStyle = G.innerStyle;
		
		drawing
			.beginPath()
			.circle(0, 0, outerRadius)
			.endPath(outerStyle)
		
			.beginPath()
			.circle(0, 0, innerRadius)
			.endPath(innerStyle)
		;
		
	}
	,drawTriangleTriangle: function(drawing, G) {
		var outerTriangle = G.outerTriangle,
			outerStyle = G.outerStyle,
			innerTriangle = G.innerTriangle,
			innerStyle = G.innerStyle;
		
		drawing
			.beginPath()
			.polygon(outerTriangle)
			.endPath(outerStyle)
			
			.beginPath()
			.polygon(innerTriangle)
			.endPath(innerStyle)
		;
	}
	,killEnemy: function(gfx, velocity) {
		var enemyGraphics = this;
		enemyGraphics.dispose();

		var particleOptions = this.getParticleOptions();
		gfx.createExplosion(enemyGraphics, velocity, particleOptions);
	}
});
