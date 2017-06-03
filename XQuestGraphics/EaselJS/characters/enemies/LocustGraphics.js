Balance.onUpdate(mode => {
	var outerRadius = Balance.enemies.locust.radius,
		outerOffset = 0,
		innerRadius = outerRadius * 6 / 11,
		innerOffset = outerRadius * 3 / 11;
	var orange = 'hsl(40, 100%, 50%)', red = 'hsl(0, 100%, 30%)';

	_.merge(Graphics, {
		enemies: {
			locust: {
				visibleRadius: Balance.enemies.locust.radius + 1,
				triangleTriangle: {
					outerTriangle: Smart.Drawing.polygonFromAngles(0, outerOffset, outerRadius, [ 0, 130, 230 ]),
					outerStyle: { fillStyle: orange },

					innerTriangle: Smart.Drawing.polygonFromAngles(0, innerOffset, innerRadius, [ 0, 130, 230 ]),
					innerStyle: { fillStyle: red, strokeStyle: 'black' }
				},
				explosionOptions: {
					count: 20,
					speed: 500,
					style: {
						fillStyle: 'hsl(40, 100%, 50%)'
					}
				}
			}
		}
	});
});

EaselJSGraphics.LocustGraphics = Smart.Class(new EaselJSGraphics.BaseEnemyGraphics(), {
	setup() {
		var G = Graphics.enemies.locust;
		this.visibleRadius = G.visibleRadius;
	},
	drawEffects(drawing) {
		var G = Graphics.enemies.locust;
		this.drawTriangleTriangle(drawing, G.triangleTriangle);
	},
	getExplosionOptions() {
		var G = Graphics.enemies.locust;
		return G.explosionOptions;
	}
});
