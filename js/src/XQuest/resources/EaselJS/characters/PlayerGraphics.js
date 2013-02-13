var PlayerGraphics = function() {

	this._setupGraphics();

};
PlayerGraphics.prototype = new createjs.Shape();
PlayerGraphics.implement({

	_setupGraphics: function(){
		var g = this.graphics, v = Graphics.player;
		g.clear();

		g.beginStyle(v.outerStrokeStyle)
		 .drawCircle(0, 0, v.diameter)
		 .endStroke();

		g.beginStyle(v.innerStrokeStyle)
		 .drawPolyStar(0, 0, v.innerRadius, v.innerStarPoints, v.innerStarSize, v.innerSpin)
		 .endStroke();

	}

	, moveTo: function(x, y) {
		this.x = x;
		this.y = y;
	}
});
