Balance.onUpdate(function(mode) {
	var outerRadius = Balance.enemies.locust.radius
		, outerOffset = 0
		, innerRadius = outerRadius * 6 / 11
		, innerOffset = outerRadius * 3 / 11;
	var orange = 'hsl(40, 100%, 50%)', red = 'hsl(0, 100%, 30%)';

	_.merge(Graphics, {
		enemies: {
			locust: {
				visibleRadius: Balance.enemies.locust.radius + 1
				,triangleTriangle: {
					outerTriangle: EaselJSGraphics.DrawingBase.polygonFromAngles(0, outerOffset, outerRadius, [ 0, 130, 230 ])
					,outerStyle: { fillStyle: orange }
					
					,innerTriangle: EaselJSGraphics.DrawingBase.polygonFromAngles(0, innerOffset, innerRadius, [ 0, 130, 230 ])
					,innerStyle: { fillStyle: red, strokeStyle: 'black' }
				}
				,particles: {
					count: 20
					,speed: 500
					,style: {
						fillColor: 'hsl(40, 100%, 50%)'
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

EaselJSGraphics.LocustGraphics = Smart.Class(new EaselJSGraphics.BaseEnemyGraphics(), {
	setup: function(){
		var G = Graphics.enemies.locust;
		this.visibleRadius = G.visibleRadius; 
	}
	,drawEffects: function(drawing) {
		var G = Graphics.enemies.locust;
		this.drawTriangleTriangle(drawing, G.triangleTriangle);
	}
	,getParticleOptions: function() {
		var G = Graphics.enemies.locust;
		return G.particles;
	}
});
