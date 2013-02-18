var CrystalGraphic = function() {
	this._setupCrystalGraphic();
};
CrystalGraphic.prototype = new createjs.Shape();
CrystalGraphic.implement(AnimationQueue.prototype);
CrystalGraphic.implement({
	_setupCrystalGraphic: function() {
		var g = this.graphics, v = Graphics.crystals;
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
	gatherCrystal: function(playerGraphic) {
		this.addAnimation(
			new Animation()
				.duration(Graphics.crystals.gatherDuration).ease()
				.move({ target: this, to: playerGraphic })
		);
		this.addAnimation(
			new Animation().duration(Graphics.crystals.gatherDuration).easeOut()
				.addAction(function(anim) {
					this.spinRate = Animation.interpolate(Graphics.crystals.spinRate, Graphics.crystals.spinRate * -20, anim.position);
				}.bind(this))
		);

	}

});