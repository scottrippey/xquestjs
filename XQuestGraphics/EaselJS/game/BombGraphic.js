EaselJSGraphics.BombGraphic = Smart.Class(new createjs.Shape(), {
	initialize: function BombGraphic() {
		this.radius = Balance.player.radius;
		this._setupGraphics();
	}
	,
	_setupGraphics: function() {
		var G = Graphics.bombs;
		this.graphics
			.clear()
			.beginStyle(G.style)
			.drawCircle(0, 0, this.radius)
			.endStyle(G.style)
		;
	}
	,
	onTick: function(tickEvent) {
		var B = Balance.bombs, bounds = Balance.level.bounds;
		this.radius += (B.speed * tickEvent.deltaSeconds);
		this.alpha = 1 - (this.radius / bounds.totalWidth);
		if (this.alpha <= 0) {
			this.destroy();
		}

		this._setupGraphics();
	}
});
