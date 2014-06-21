EaselJSGraphics.PlayerGraphics = Smart.Class(new createjs.Shape(), {
	initialize: function() {
		this._setupGraphics();
	}
	,
	_setupGraphics: function(){
		var g = this.graphics, G = Graphics.player;
		this.visibleRadius = G.radius;
		g.clear();

		g.beginStyle(G.outerStrokeStyle)
		 .drawCircle(0, 0, G.radius)
		 .endStroke();

		g.beginStyle(G.innerStyle)
		 .drawPolyStar(0, 0, G.innerRadius, G.innerStarPoints, G.innerStarSize, 0)
		 .endStyle(G.innerStyle);

	}
	,
	onTick: function(tickEvent) {
		this.rotation += (Graphics.player.spinRate * tickEvent.deltaSeconds);
	}
	,
	killPlayerGraphics: function(gfx, velocity) {
		var G = Graphics.player;
		this.toggleVisible(false);
		gfx.createExplosion(this, velocity, G.particles);
	}
	,
	restorePlayerGraphics: function() {
		this.toggleVisible(true);
	}
});
