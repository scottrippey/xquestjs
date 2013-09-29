EaselJSGraphics.CrystalGraphic = Class.create(new createjs.Shape(), {
	initialize: function(gfx) {
		this.gfx = gfx;
		this._setupCrystalGraphic();
	}
	,
	_setupCrystalGraphic: function() {
		var v = Graphics.crystals;
		this.graphics
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
	gatherCrystal: function(playerLocation) {
		var crystal = this;
		crystal.gfx.addAnimation(new Animation()
			.duration(Graphics.crystals.gatherDuration)

			.savePosition()
			.easeIn('quint')
			.move(crystal, playerLocation)
			.fade(crystal, [0.03, 0])

			.restorePosition()
			.easeOut('quint')
			.tween(function(s) { crystal.spinRate = s; }, [ crystal.spinRate, Graphics.crystals.spinRateGathered ])

			.queue(function(animEvent) {
				crystal.gfx.removeGraphic(crystal);
			})
		);
	}
});
