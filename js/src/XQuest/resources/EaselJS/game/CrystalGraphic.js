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
	}
	,
	onTick: function(tickEvent) {
		this.rotation += (Graphics.crystals.spinRate * tickEvent.deltaSeconds);

		this.updateAnimations(tickEvent.deltaSeconds);
	}
	,
	gatherCrystal: function(playerGraphic) {
		this.addAnimation(
			new Animation().duration(Graphics.crystals.gatherDuration).ease()
				.move({ target: this, to: playerGraphic })
		);

	}

});