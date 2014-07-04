EaselJSGraphics.BaseEnemyGraphics = Smart.Class(new EaselJSGraphics.Drawing(), {
	initialize: function() {
		this.BaseEnemyGraphics_initialize();
	}
	,BaseEnemyGraphics_initialize: function() {
		this.Drawing_initialize();
	}
	,drawCircleCircle: function(drawing, G) {
		var radius = G.radius,
			outerRadius = G.radius,
			outerStyle = G.outerStyle,
			innerRadius = G.innerRadius,
			innerStyle = G.innerStyle;
		
		this.visibleRadius = radius;
		
		drawing
			.beginPath()
			.circle(0, 0, outerRadius)
			.drawPath(outerStyle)
		
			.beginPath()
			.circle(0, 0, innerRadius)
			.drawPath(innerStyle)
		;
		
	}
	,drawTriangleTriangle: function(drawing, G) {
		var radius = G.radius,
			outerTriangle = G.triangle,
			outerStyle = G.outerStyle,
			innerTriangle = G.innerTriangle,
			innerStyle = G.innerStyle;
		
		this.visibleRadius = radius;
		
		drawing
			.beginPath()
			.polygon(outerTriangle)
			.drawPath(outerStyle)
			
			.beginPath()
			.polygon(innerTriangle)
			.drawPath(innerStyle)
		;
	}
	,killEnemy: function(gfx, velocity) {
		var enemyGraphics = this, G = Graphics.enemies.locust;
		enemyGraphics.dispose();

		var particleOptions = G.particles;
		gfx.createExplosion(enemyGraphics, velocity, particleOptions);
	}
});
