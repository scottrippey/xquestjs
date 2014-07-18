Balance.onUpdate(function(gameMode) {
	var B = Balance.enemies.roach;
	var blue = 'hsl(200, 100%, 50%)', white = 'hsla(0, 100%, 100%, 0.8)', black = 'black';
	Graphics.merge({
		enemies: {
			roach: {
				radius: B
				, circleCircle: {
					outerRadius: B.radius + 1
					, outerStyle: { fillStyle: blue }
					, innerRadius: B.radius * 0.7
					, innerStyle: { fillStyle: white, strokeStyle: black }
				}
				,explosionOptions: {
					count: 20
					,speed: 500
					,style: {
						fillStyle: blue
					}
				}
			}
			
		}
	});
});

EaselJSGraphics.RoachGraphics = Smart.Class(new EaselJSGraphics.BaseEnemyGraphics(), {
	setup: function() {
		var G = Graphics.enemies.roach;
		this.visibleWidth = G.radius;
	},
	drawEffects: function(drawing, tickEvent) {
		var G = Graphics.enemies.roach;
		this.drawCircleCircle(drawing, G.circleCircle);
	}
	, getExplosionOptions: function() {
		var G = Graphics.enemies.roach;
		return G.explosionOptions;
	}
});