var CrystalGraphic = function() {
	this._setupCrystalGraphic();
};
CrystalGraphic.prototype = new createjs.Shape();
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
	}

});