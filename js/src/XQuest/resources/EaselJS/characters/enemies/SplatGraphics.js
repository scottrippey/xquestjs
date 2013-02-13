var SplatGraphics = function() {

	this._setupGraphics();

};
SplatGraphics.prototype = new createjs.Shape();
SplatGraphics.implement({

	_setupGraphics: function(){
		var g = this.graphics, v = Graphics.enemies.splat;
		g.clear();

		g.beginStyle(v.outerFillStyle)
			.drawCircle(0, 0, v.radius)
			.endFill();
		g.beginStyle(v.innerFillStyle)
			.drawCircle(0, 0, v.innerRadius)
			.endFill()
			.beginStyle(v.innerStyle)
			.drawCircle(0, 0, v.innerRadius)
			.endStyle(v.innerStyle);

	}

	, moveTo: function(x, y) {
		this.x = x;
		this.y = y;
	}

	,
	killSplat: function(gfx, velocity) {
		var enemyGraphics = this;
		gfx.removeGraphic(enemyGraphics);

		var particleOptions = Graphics.enemies.splat.particles;
		particleOptions.position = enemyGraphics;
		particleOptions.velocity = { x: 0, y: 0 };

		var particleCount = 10, partSpeed = particleOptions.speed;
		for (var i = 0; i < particleCount; i++) {
			particleOptions.velocity.x = velocity.x + partSpeed - 2 * partSpeed * Math.random();
			particleOptions.velocity.y = velocity.y + partSpeed - 2 * partSpeed * Math.random();
			gfx.addParticle(particleOptions);
		}
	}
});
