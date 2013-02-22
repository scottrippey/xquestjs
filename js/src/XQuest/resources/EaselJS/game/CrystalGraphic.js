var CrystalGraphic = function(gfx) {
	this.gfx = gfx;
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
		this.queueAnimation(
			new Animation()
				.duration(Graphics.crystals.gatherDuration).ease()
				.move({ target: this, to: playerGraphic })
			,
			new Animation().duration(Graphics.crystals.gatherDuration).easeOut()
				.addAction(function(anim) {
					this.spinRate = Animation.interpolate(Graphics.crystals.spinRate, Graphics.crystals.spinRateGathered, anim.position);
				}.bind(this))
			,
			new Animation().duration(Graphics.crystals.gatherDuration).easeOut()
				.addAction(function(anim) {
					this.alpha = 1 - anim.position;
				}.bind(this))
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