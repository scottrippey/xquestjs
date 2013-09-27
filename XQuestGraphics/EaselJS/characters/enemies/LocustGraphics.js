(function() {
	var G;
	Balance.onUpdate(function(mode) {
		G = {
			radius: Balance.enemies.locust.radius + 1
			, outerFillStyle: {
				fillColor: '#999900'
			}
			, innerRadius: Balance.enemies.locust.radius * (5/8)
			, innerFillStyle: {
				fillColor: '#DDDD00'
			}
			, innerStyle: {
				strokeColor: '#000000'
			}
			, particles: {
				count: 20
				,speed: 300
				,style: {
					fillColor: '#999900'
				}
				,radius: 4
				,friction: 0.9
				,getAnimation: function(particle) {
					return new Animation()
						.duration(3)
						.easeOut()
						.fade({ target: particle, to: 0 })
						;
				}
			}
		};
	});

	LocustGraphics = Class.create(new createjs.Shape(), {
		initialize: function() {
			this._setupGraphics();
		}
		,
		_setupGraphics: function(){
			var g = this.graphics;
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
		killLocust: function(gfx, velocity) {
			var enemyGraphics = this;
			gfx.removeGraphic(enemyGraphics);

			var particleOptions = G.particles;
			gfx.createExplosion(enemyGraphics, velocity, particleOptions);
		}
	});
})();
