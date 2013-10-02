Balance.onUpdate(function(mode) {
	var radius = Balance.enemies.locust.radius
		, offset = radius * 0.3
		, innerRadius = radius * 0.6
		, innerOffset = innerRadius * -0.2
		, edge = 0.9
		;

	_.merge(Graphics, {
		enemies: {
			locust: {
				radius: radius + 1
				, triangle: [[0, -radius - offset], [radius * edge, radius - offset], [-radius * edge, radius - offset]]
				, outerStyle: {
					fillColor: 'hsl(40, 100%, 50%)'
				}
				, innerTriangle: [[0, -innerRadius - innerOffset], [innerRadius * edge, innerRadius - innerOffset], [-innerRadius * edge, innerRadius - innerOffset]]
				, innerStyle: {
					fillColor: 'hsl(0, 100%, 30%)'
					,strokeColor: 'black'
				}
				, particles: {
					count: 20
					,speed: 500
					,style: {
						fillColor: 'hsl(40, 100%, 50%)'
					}
					,radius: 4
					,friction: 0.95
					,getAnimation: function(particle) {
						return new Animation()
							.duration(3).easeOut()
							.fade(particle, 0);
					}
				}
			}
		}
	});
});

EaselJSGraphics.LocustGraphics = Smart.Class(new createjs.Shape(), {
	initialize: function() {
		this._setupGraphics();
	}
	,
	_setupGraphics: function(){
		var g = this.graphics, G = Graphics.enemies.locust;
		g.clear();

		g.beginStyle(G.outerStyle)
			.drawPolygon(G.triangle)
			.endStyle(G.outerStyle);

		g.beginStyle(G.innerStyle)
			.drawPolygon(G.innerTriangle)
			.endStyle(G.innerStyle);

	}
	,
	killEnemy: function(gfx, velocity) {
		var enemyGraphics = this, G = Graphics.enemies.locust;
		gfx.removeGraphic(enemyGraphics);

		var particleOptions = G.particles;
		gfx.createExplosion(enemyGraphics, velocity, particleOptions);
	}
});
