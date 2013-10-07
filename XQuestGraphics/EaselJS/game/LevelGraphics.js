EaselJSGraphics.LevelGraphics = Smart.Class(new createjs.Shape(), {
	gateStart: null, gateEnd: null, gateOpen: false
	,
	initialize: function() {

	}
	,
	setGateWidth: function(gateWidth) {
		var bounds = Balance.level.bounds;
		this.gateStart = {
			x: bounds.x + (bounds.width - gateWidth) / 2
			,y: bounds.y
		};
		this.gateEnd = {
			x: this.gateStart.x + gateWidth
			,y: bounds.y
		};
		this.gateOpen = false;
	}
	,
	openGate: function() {
		this.gateOpen = true;
	}
	,
	closeGate: function() {
		this.gateOpen = false;
	}

	,
	onTick: function(tickEvent){
		this.graphics.clear();
		this._drawWalls();
		this._drawGate();
	}
	,
	_drawWalls: function() {
		var g = this.graphics
			, level = Graphics.level
			, bounds = Balance.level.bounds
			, strokeWidth = Graphics.level.strokeStyle.strokeWidth - 2
			, gateStart = this.gateStart
			, gateEnd = this.gateEnd;

		// Draw a rounded rectangle with a "gap" for the gate:
		// TODO: Cache these calculated values:
		var halfPI = Math.PI / 2
			,angles = {
				top: halfPI * 3
				,right: 0
				,bottom: halfPI
				,left: Math.PI
			}
			,arcCorners = {
				left: bounds.x + level.cornerRadius - strokeWidth / 2
				,right: bounds.x + bounds.width - level.cornerRadius + strokeWidth
				,top: bounds.y + level.cornerRadius - strokeWidth / 2
				,bottom: bounds.y + bounds.height - level.cornerRadius + strokeWidth
			};

		g.beginStyle(level.strokeStyle)
			.moveTo(gateEnd.x, gateEnd.y)
			.arc(arcCorners.right, arcCorners.top, level.cornerRadius, angles.top, angles.right)
			.arc(arcCorners.right, arcCorners.bottom, level.cornerRadius, angles.right, angles.bottom)
			.arc(arcCorners.left, arcCorners.bottom, level.cornerRadius, angles.bottom, angles.left)
			.arc(arcCorners.left, arcCorners.top, level.cornerRadius, angles.left, angles.top)
			.lineTo(gateStart.x, gateStart.y)
			.endStroke();

	}
	,
	_drawGate: function() {
		if (this.gateOpen) return;

		var g = this.graphics
			, gate = Graphics.gate
			, gateStart = this.gateStart
			, gateEnd = this.gateEnd;

		this._drawElectricLine(g, gate, gateStart, gateEnd);
	}
	,
	_drawElectricLine: function(graphics, gate, gateStart, gateEnd) {
		graphics.beginStyle(gate.strokeStyle)
			.moveTo(gateStart.x, gateStart.y);

		var diff = {
			x: (gateEnd.x - gateStart.x)
			,y: (gateEnd.y - gateStart.y)
		};
		var segments = gate.segments;
		for (var i = 1; i <= segments; i++) {
			var pos = Smart.Interpolate.points(gateStart, gateEnd, i / segments);
			var dist = Math.min(segments - i, i) / segments
				,deviation = dist * gate.deviation * (Math.random() - 0.5);
			if (diff.y)
				pos.x += -diff.y * deviation;
			if (diff.x)
				pos.y += diff.x * deviation;
			graphics.lineTo(pos.x, pos.y);
		}
		graphics.endStroke();
	}

	,
	/**
	 * Detects if the location is outside the level's bounds, or if it's inside the gate.
	 * @param location
	 * @param radius
	 * @returns String - Either: null, 'level-wall', 'open-gate', or 'closed-gate'
	 */
	levelCollision: function(location, radius) {
		var bounds = Balance.level.bounds;
		var wall = Smart.Physics.checkBounds(location, radius, bounds);

		if (!wall) return null;

		// Detect collision with the gate:
		var insideGate = (wall.edge === 'top' && (location.x >= this.gateStart.x) && (location.x <= this.gateEnd.x));
		if (insideGate) {
			if (this.gateOpen) {
				wall.insideGate = true;
				wall.insideGateDistance = -wall.distance;

				if (Point.distanceTest(location, this.gateStart, radius)) {
					wall.touchingGate = this.gateStart;
				} else if (Point.distanceTest(location, this.gateEnd, radius)) {
					wall.touchingGate = this.gateEnd;
				}
			}

		}

		return wall;

	}

	,
	getMiddleOfGame: function() {
		var bounds = Balance.level.bounds
			, middleOfGame = {
				x: bounds.x + (bounds.width / 2)
				,y: bounds.y + (bounds.height / 2)
			};
		return middleOfGame;
	}
	,
	getTopOfGame: function() {
		var bounds = Balance.level.bounds
			, topOfGame = {
				x: bounds.x + (bounds.width / 2)
				,y: bounds.y
			};
		return topOfGame;
	}
});
