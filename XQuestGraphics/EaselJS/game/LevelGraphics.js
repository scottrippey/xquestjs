var LevelGraphics = new Class(new createjs.Shape(), {
	initialize: function() {

	}
	,
	onTick: function(){
		var g = this.graphics
			, v = Graphics.level
			, bounds = Graphics.level.bounds
			, strokeWidth = Graphics.level.strokeStyle.strokeWidth - 2;
		g.clear();

		g.beginStyle(v.strokeStyle)
		 .drawRoundRect(bounds.x - strokeWidth/2, bounds.y - strokeWidth/2, bounds.width + strokeWidth, bounds.height + strokeWidth, v.cornerRadius)
		 .endStroke();

		this._drawGate();

	}
	,
	setGateWidth: function(gateWidth) {
		var bounds = Graphics.level.bounds;
		this.gateStart = {
			x: bounds.x + (bounds.width - gateWidth) / 2
			,y: bounds.y
		};
		this.gateEnd = {
			x: this.gateStart.x + gateWidth
			,y: bounds.y
		};
	}
	,
	_drawGate: function() {
		var g = this.graphics
			, gate = Graphics.gate
			, gateStart = this.gateStart
			, gateEnd = this.gateEnd;

		g.beginStyle(gate.strokeStyle)
			.moveTo(gateStart.x, gateStart.y);

		var diff = {
			x: (gateEnd.x - gateStart.x)
			,y: (gateEnd.y - gateStart.y)
		};
		var segments = gate.segments;
		for (var i = 1; i <= segments; i++) {
			var pos = Physics.interpolatePoints(gateStart, gateEnd, i / segments);
			var dist = Math.min(segments - i, i) / segments
				,deviation = dist * gate.deviation * (Math.random() - 0.5);
			if (diff.y)
				pos.x += -diff.y * deviation;
			if (diff.x)
				pos.y += diff.x * deviation;
			g.lineTo(pos.x, pos.y);
		}
		g.endStroke();
	}
});
