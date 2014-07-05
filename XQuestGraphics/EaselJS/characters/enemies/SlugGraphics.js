
Balance.onUpdate(function(mode) {
	var green = 'hsl(100, 100%, 50%)';
	var darkGreen = Smart.Color.darken(green, 30);
	var black = 'black';
	
	_.merge(Graphics, {
		enemies: {
			slug: {
				radius: Balance.enemies.slug.radius + 1
				, circleCircle: {
					outerRadius: Balance.enemies.slug.radius + 1
					, outerStyle: { fillStyle: darkGreen }
					, innerRadius: Balance.enemies.slug.radius * 0.7
					, innerStyle: { fillStyle: green, strokeStyle: black }
				}
				, particles: {
					count: 20
					,speed: 300
					,style: {
						fillColor: 'hsl(100, 100%, 50%)'
					}
					,radius: 4
					,friction: 0.95
					,getAnimation: function(particle) {
						return new Smart.Animation()
							.duration(3).easeOut()
							.fade(particle, 0)
							;
					}
				}
			}
		}
	});
});

EaselJSGraphics.SlugGraphics = Smart.Class(new EaselJSGraphics.BaseEnemyGraphics(), {
	setup: function() {
		var G = Graphics.enemies.slug;
		this.visibleRadius = G.radius;		
	},
	drawStatic: function(drawing, tickEvent) {
		var G = Graphics.enemies.slug;

		this.drawCircleCircle(drawing, G.circleCircle);
	}
	,
	getParticleOptions: function() {
		return Graphics.enemies.slug.particles;
	}
});

