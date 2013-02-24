var CrystalGraphic = function(gfx) {
	this._gfx = gfx;
	this._animations = [];
	this._setupCrystalGraphic();
};
CrystalGraphic.prototype = new createjs.Shape();
CrystalGraphic.implement({
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

		Animation.updateAndEliminate(this._animations, tickEvent.deltaSeconds);
	}
	,
	gatherCrystal: function(playerLocation) {
		this._animations.push(new Animation()
			.duration(Graphics.crystals.gatherDuration)

			.savePosition()
			.easeIn('quint')
			.move({ target: this, to: playerLocation })
			.fade({ target: this, from: 0.15, to: 0 })

			.restorePosition()
			.easeOut('quint')
			.animate({ from: this.spinRate, to: Graphics.crystals.spinRateGathered, update: function(spinRate) {
				this.spinRate = spinRate;
			}.bind(this)})

			.queue(function(anim) {
				this._gfx.removeGraphic(this);
			}.bind(this))
		);
	}
});