EaselJSGraphics.CrystalGraphic = Smart.Class(new createjs.Shape(), {
	initialize: function CrystalGraphic() {
		this._setupCrystalGraphic();
	}
	,
	_setupCrystalGraphic: function() {
		var G = Graphics.crystals;
		this.graphics
			.clear()
			.beginStyle(G.style)
			.drawPolyStar(0, 0, G.radius, G.sides, G.pointSize, 0)
			.endStyle(G.style);
		this.rotation = 360 * Math.random();

		this.spinRate = G.spinRate;
	}
	,
	onTick: function(tickEvent) {
		this.rotation += (this.spinRate * tickEvent.deltaSeconds);
	}
	,
	gatherCrystal: function(gfx, playerLocation) {
		var crystal = this;
		gfx.addAnimation(new Smart.Animation()
			.duration(Graphics.crystals.gatherDuration)

			.savePosition()
			.easeIn('quint')
			.move(crystal, playerLocation)

			.restorePosition()
			.scale(crystal, [0.9, 0.3])


			.restorePosition()
			.easeOut('quint')

			.tween(function(s) { crystal.spinRate = s; }, [ crystal.spinRate, Graphics.crystals.spinRateGathered ])

			.queue(function(animEvent) {
				gfx.removeGraphic(crystal);
			})
		);
	}
});
