Balance.onUpdate(function(gameMode) {
	var radius = Balance.enemies.mantis.radius;
	var red = 'hsl(10, 100%, 50%)', yellow = 'hsl(60, 100%, 50%)';
	Graphics.merge({
		enemies: {
			mantis: {
				radius: radius
				, star1: { radius: radius, sides: 7, pointSize: 0.5, color: yellow }
				, star2: { radius: radius, sides: 7, pointSize: 0.7, angle: 360 / 7 * .5, color: red }
				, pulse: 4
				,explosionOptions: {
					count: 20
					,speed: 500
					,style: {
						fillStyle: red
					}
					,radius: 4
					,friction: 0.95
					,getAnimation: function(particle) {
						return new Smart.Animation()
							.duration(3).easeOut()
							.fade(particle, 0);
					}
				}
			}
			
		}
	});
});

EaselJSGraphics.MantisGraphics = Smart.Class(new EaselJSGraphics.BaseEnemyGraphics(), {
	setup: function() {
		var G = Graphics.enemies.mantis;

		this.visibleRadius = G.radius;
		
		var star1 = Smart.Drawing.createStarPolygon(0, 0, G.star1.radius, G.star1.sides, G.star1.pointSize, 0);
		var star2 = Smart.Drawing.createStarPolygon(0, 0, G.star2.radius, G.star2.sides, G.star2.pointSize, G.star2.angle);
		
		star2.push(star2.shift());
		
		this.getStar = Smart.Interpolate.arrays(star1, star2);
		this.getStarStyle = Smart.Interpolate.colors(G.star1.color, G.star2.color);
		this.star1 = star1;
		this.star2 = star2;
		
		this.time = 0;
	}
	, drawEffects: function(drawing, tickEvent) {
		var G = Graphics.enemies.mantis;
		this.time += tickEvent.deltaSeconds;
		var pulse = (Math.sin(this.time * Math.PI * 2 / G.pulse) + 1) / 2;
		
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
	, getExplosionOptions: function() {
		var G = Graphics.enemies.mantis;
		return G.explosionOptions;
	}
});