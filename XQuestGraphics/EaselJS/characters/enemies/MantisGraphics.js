Balance.onUpdate(function(gameMode) {
	var radius = Balance.enemies.mantis.radius;
	var red = 'hsl(10, 100%, 50%)', yellow = 'hsl(60, 100%, 50%)';
	Graphics.merge({
		enemies: {
			mantis: {
				radius
				, star1: { radius, sides: 7, pointSize: 0.5, color: yellow }
				, star2: { radius, sides: 7, pointSize: 0.7, angle: 360 / 7 * .5, color: red }
				, pulse: 4
				,explosionOptions: {
					count: 20
					,speed: 500
					,style: {
						fillStyle: red
					}
				}
			}
			
		}
	});
});

EaselJSGraphics.MantisGraphics = Smart.Class(new EaselJSGraphics.BaseEnemyGraphics(), {
	setup() {
		var G = Graphics.enemies.mantis;

		this.visibleRadius = G.radius;
		
		var star1 = Smart.Drawing.createStarPolygon(0, 0, G.star1.radius, G.star1.sides, G.star1.pointSize, 0);
		var star2 = Smart.Drawing.createStarPolygon(0, 0, G.star2.radius, G.star2.sides, G.star2.pointSize, G.star2.angle);
		
		star2.push(star2.shift());
		
		this.getStar = Smart.Interpolate.arrays(star1, star2);
		this.getStarColor = Smart.Interpolate.colors(G.star1.color, G.star2.color);
		this.star1 = star1;
		this.star2 = star2;
		
		this.time = 0;
	}
	, drawEffects(drawing, tickEvent) {
		var G = Graphics.enemies.mantis;
		this.time += tickEvent.deltaSeconds;
		var pulse = (Math.sin(this.time * Math.PI * 2 / G.pulse) + 1) / 2;
		
		this.starColor = this.getStarColor(pulse);
		
		drawing
			.beginPath()
			.polygon(this.getStar(pulse))
			.closePath()
			.fillStyle(this.starColor)
			.fill()
		;
	}
	, getExplosionOptions() {
		var G = Graphics.enemies.mantis;
		var explosionOptions = _.defaults({ style: { fillStyle: this.starColor } }, G.explosionOptions);
		return explosionOptions;
	}
});