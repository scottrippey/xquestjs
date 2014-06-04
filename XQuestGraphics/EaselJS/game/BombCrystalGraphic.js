EaselJSGraphics.BombCrystalGraphic = Smart.Class(new createjs.Shape(), {
	initialize: function BombCrystalGraphic() {
		this._setupGraphics();
	}
	, _setupGraphics: function() {
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
	
	, onTick: function(tickEvent) {
		this.rotation += (this.spinRate * tickEvent.deltaSeconds);
	}

	, gatherBombCrystal: function(gfx, playerLocation) {
		var bombCrystal = this;
		return gfx.addAnimation(new Smart.Animation()
			.duration(Graphics.bombCrystals.gatherDuration)
			.savePosition()

			.easeOut('quint')
			.move(bombCrystal, playerLocation)

			.restorePosition()
			.easeOut('quint')
			.scale(bombCrystal, [1, 2, 2.5, 2, 1, 0])

			.queue(function(animEvent) {
				gfx.removeGraphic(bombCrystal);
			})
		);
	}
});
