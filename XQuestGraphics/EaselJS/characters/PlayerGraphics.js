var PlayerGraphics = Class.create(new createjs.Shape(), {
	initialize: function() {
		this._setupGraphics();
	}
	,
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
	,
	onTick: function(tickEvent) {
		this.rotation += (Graphics.player.spinRate * tickEvent.deltaSeconds);
	}
	,
	killPlayer: function() {
		// TODO.

		// TEMP:
		Graphics.player.innerStyle.fillColor = 'red';
	}
});
