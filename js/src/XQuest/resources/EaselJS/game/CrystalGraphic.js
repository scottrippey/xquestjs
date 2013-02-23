var CrystalGraphic = function(gfx) {
	this.gfx = gfx;
	this._setupCrystalGraphic();
};
CrystalGraphic.prototype = new createjs.Shape();
CrystalGraphic.implement(AnimationQueue.prototype);
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

		this.updateAnimations(tickEvent.deltaSeconds);
	}
	,
	gatherCrystal: function(playerLocation) {
		this.queueAnimation(
			new Animation()
				.duration(Graphics.crystals.gatherDuration)
				.easeIn()
				.move({ target: this, to: playerLocation })
			,
			new Animation()
				.duration(Graphics.crystals.gatherDuration)
				.easeIn()
				.fade({ target: this, from: 0.1, to: 0 })
			,
			new Animation()
				.duration(Graphics.crystals.gatherDuration)
				.easeOut()
				.animate({ from: this.spinRate, to: Graphics.crystals.spinRateGathered, update: function(spinRate) {
					this.spinRate = spinRate;
				}.bind(this)})
		).queueAnimation(
			Animation.execute(function(){
				this._removeGraphic();
			}.bind(this))
		);
	}
	,
	_removeGraphic: function() {
		this.gfx.removeGraphic(this);
	}

});