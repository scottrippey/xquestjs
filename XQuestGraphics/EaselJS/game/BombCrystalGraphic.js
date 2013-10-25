EaselJSGraphics.BombCrystalGraphic = Smart.Class(new createjs.Shape(), {
	initialize: function BombCrystalGraphic() {
		this._setupGraphics();
	}
	,
	_setupGraphics: function() {
		var G = Graphics.bombCrystals;
		this.graphics
			.clear()
			.beginStyle(G.style)
			.drawPolyStar(0, 0, G.radius, G.sides, G.pointSize, 0)
			.endStyle(G.style)

			.beginStyle(G.styleInner)
			.drawPolyStar(0, 0, G.radiusInner, G.sides, G.pointSize, 0)
			.endStyle(G.styleInner)
		;
		this.rotation = 360 * Math.random();

		this.spinRate = G.spinRate;
	}
	,
	onTick: function(tickEvent) {
		this.rotation += (this.spinRate * tickEvent.deltaSeconds);
	}
});
