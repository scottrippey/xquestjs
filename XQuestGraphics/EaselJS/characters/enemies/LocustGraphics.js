Balance.onUpdate(function(mode) {
	var outerRadius = Balance.enemies.locust.radius
		, outerOffset = 0
		, innerRadius = outerRadius * 7 / 13
		, innerOffset = outerRadius * 4 / 13;
	var orange = 'hsl(40, 100%, 50%)', red = 'hsl(0, 100%, 30%)';

	_.merge(Graphics, {
		enemies: {
			locust: {
				visibleRadius: outerRadius + 1
				,triangleTriangle: {
					outerTriangle: Smart.Drawing.polygonFromAngles(0, outerOffset, outerRadius, [ 0, 130, 230 ])
					,outerStyle: { fillStyle: orange }
					
					,innerTriangle: Smart.Drawing.polygonFromAngles(0, innerOffset, innerRadius, [ 0, 130, 230 ])
					,innerStyle: { fillStyle: red, strokeStyle: 'black' }
				}
				,explosionOptions: {
					count: 20
					,speed: 500
					,style: {
						fillStyle: 'hsl(40, 100%, 50%)'
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
	,getExplosionOptions: function() {
		var G = Graphics.enemies.locust;
		return G.explosionOptions;
	}
});
