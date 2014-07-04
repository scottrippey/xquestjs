Balance.onUpdate(function(gameMode) {
	Graphics.merge({
		enemies: {
			mantis: {
				radius: 12
				, star1: { radius: 12, sides: 7, pointSize: 0.5, color: 'hsl(40, 100%, 50%)' }
				, star2: { radius: 12, sides: 7, pointSize: 0.7, angle: 36, color: 'hsl(15, 100%, 50%)' }
				, starStyle: { fillStyle: 'red' }
				, pulse: 2
			}
		}
	});
});

EaselJSGraphics.MantisGraphics = Smart.Class(new EaselJSGraphics.BaseEnemyGraphics(), {
	initialize: function() {
		this.BaseEnemyGraphics_initialize();
		
		this._setupStar();
	}
	, _setupStar: function() {
		var G = Graphics.enemies.mantis;

		this.visibleRadius = G.radius;
		
		var star1 = EaselJSGraphics.DrawingBase.createStarPolygon(0, 0, G.star1.radius, G.star1.sides, G.star1.pointSize, 0);
		var star2 = EaselJSGraphics.DrawingBase.createStarPolygon(0, 0, G.star2.radius, G.star2.sides, G.star2.pointSize, G.star2.angle);
		
		star2.push(star2.shift());
		
		this.getStar = Smart.Interpolate.arrays(star1, star2);
		this.getStarStyle = Smart.Interpolate.colors(G.star1.color, G.star2.color);
		this.star1 = star1;
		this.star2 = star2;
	}
	, drawEffects: function(drawing, tickEvent) {
		var G = Graphics.enemies.mantis;
		var pulse = (Math.sin(tickEvent.time / 1000 * Math.PI * 2 / G.pulse) + 1) / 2;
		
		drawing
//			.beginPath().polygon(this.star1).fillStyle('hsla(0, 100%, 50%, 0.2)').fill()
//			.beginPath().polygon(this.star2).fillStyle('hsla(200, 100%, 50%, 0.2)').fill()
//			.beginPath().polygon(this.getStar(pulse)).strokeStyle('hsla(0,100%,100%, 0.3)').stroke()
			.beginPath()
			.polygon(this.getStar(pulse))
			//.circle(0, 0, G.radius)
			.closePath()
			.fillStyle(this.getStarStyle(pulse))
			.fill()
		;
	}
});