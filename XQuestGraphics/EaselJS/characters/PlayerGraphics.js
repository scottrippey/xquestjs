var PlayerGraphics = function() {

	this._setupGraphics();

};
PlayerGraphics.prototype = new createjs.Shape();
PlayerGraphics.implement({

	_setupGraphics: function(){
		var g = this.graphics, v = Graphics.player;
		g.clear();

		g.beginStyle(v.outerStrokeStyle)
		 .drawCircle(0, 0, v.radius)
		 .endStroke();

		g.beginStyle(v.innerStyle)
		 .drawPolyStar(0, 0, v.innerRadius, v.innerStarPoints, v.innerStarSize, 0)
		 .endStyle(v.innerStyle);

	}

	, moveTo: function(x, y) {
		this.x = x;
		this.y = y;
	}

	, onTick: function(tickEvent) {
		this.rotation += (Graphics.player.spinRate * tickEvent.deltaSeconds);
	}
});
