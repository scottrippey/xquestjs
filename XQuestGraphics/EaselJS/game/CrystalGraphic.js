EaselJSGraphics.CrystalGraphic = Smart.Class(new createjs.Shape(), {
	initialize: function() {
		this._setupCrystalGraphic();
	}
	,
	_setupCrystalGraphic: function() {
		var v = Graphics.crystals;
		this.graphics
			.clear()
			.beginStyle(v.style)
			.drawPolyStar(0, 0, v.radius, v.sides, v.pointSize, 0)
			.endStyle(v.style);
		this.rotation = 360 * Math.random();

		this.spinRate = Graphics.crystals.spinRate;
	}
	,
	onTick: function(tickEvent) {
		this.rotation += (this.spinRate * tickEvent.deltaSeconds);
	}
	,
	gatherCrystal: function(gfx, playerLocation) {
		var crystal = this;
		gfx.addAnimation(new Animation()
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
