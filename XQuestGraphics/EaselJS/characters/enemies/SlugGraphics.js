
Balance.onUpdate(function(mode) {
	_.merge(Graphics, {
		enemies: {
			slug: {
				radius: Balance.enemies.slug.radius + 1
				, outerFillStyle: {
					fillColor: 'hsl(100, 100%, 30%)'
				}
				, innerRadius: Balance.enemies.slug.radius * (0.7)
				, innerFillStyle: {
					fillColor: 'hsl(100, 100%, 50%)'
				}
				, innerStyle: {
					strokeColor: 'black'
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
						return new Animation()
							.duration(3).easeOut()
							.fade(particle, 0)
							;
					}
				}
			}
		}
	});
});

EaselJSGraphics.SlugGraphics = Smart.Class(new createjs.Shape(), {
	initialize: function() {
		this._setupGraphics();
	}
	,
	_setupGraphics: function(){
		var g = this.graphics, G = Graphics.enemies.slug;
		g.clear();

		g.beginStyle(G.outerFillStyle)
			.drawCircle(0, 0, G.radius)
			.endFill();
		g.beginStyle(G.innerFillStyle)
			.drawCircle(0, 0, G.innerRadius)
			.endFill()
			.beginStyle(G.innerStyle)
			.drawCircle(0, 0, G.innerRadius)
			.endStyle(G.innerStyle);

	}
	,
	killEnemy: function(gfx, velocity) {
		var enemyGraphics = this, G = Graphics.enemies.slug;
		gfx.removeGraphic(enemyGraphics);

		var particleOptions = G.particles;
		gfx.createExplosion(enemyGraphics, velocity, particleOptions);
	}
});

