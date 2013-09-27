var SlugGraphics = Class.create(new createjs.Shape(), {
	initialize: function() {
		this._setupGraphics();
	}
	,
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
	,
	killSlug: function(gfx, velocity) {
		var enemyGraphics = this;
		gfx.removeGraphic(enemyGraphics);

		var particleOptions = Graphics.enemies.splat.particles;
		gfx.createExplosion(enemyGraphics, velocity, particleOptions);
	}
});
