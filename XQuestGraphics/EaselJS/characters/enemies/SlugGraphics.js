
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
				, explosionOptions: {
					count: 20
					,speed: 300
					,style: {
						fillStyle: 'hsl(100, 100%, 50%)'
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
	getExplosionOptions: function() {
		var G = Graphics.enemies.slug;
		return G.explosionOptions;
	}
});

