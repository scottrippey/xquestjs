EaselJSGraphics.PowerCrystalGraphic = Smart.Class(new createjs.Shape(), {
	initialize: function PowerCrystalGraphic() {
		this._setupGraphics();
	}
	,
	_setupGraphics: function() {
		var G = Graphics.powerCrystals;
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
	,
	gatherPowerCrystal: function(gfx, playerLocation) {
		var powerCrystal = this;
		gfx.addAnimation(new Smart.Animation()
			.duration(Graphics.powerCrystals.gatherDuration)
			.savePosition()

			.easeOut('quint')
			.move(powerCrystal, playerLocation)

			.restorePosition()
			.easeOut('quint')
			.scale(powerCrystal, [1, 2, 2.5, 2, 1, 0])

			.queue(function(animEvent) {
				gfx.removeGraphic(powerCrystal);
			})
		);
	}

});
