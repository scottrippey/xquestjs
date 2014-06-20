

EaselJSGraphics.DrawingBase = Smart.Class({
	addCommand: null // Must be overridden
});

// Native canvas methods; create proxies:
[
	'moveTo', 'lineTo', 'arc', 'arcTo', 'quadraticCurveTo', 'bezierCurveTo', 'rect'
	,'beginPath', 'fill', 'stroke'
].forEach(function(methodName) {
	EaselJSGraphics.DrawingBase.prototype[methodName] = function _canvas_method_() {
		var methodArgs = arguments;
		this.addCommand(function(context) {
			context[methodName].apply(context, methodArgs);
		});
		return this;
	}
});
// Native canvas properties; create setters:
['strokeStyle', 'fillStyle', 'lineWidth', 'lineCap', 'lineJoin', 'miterLimit'].forEach(function(propName) {
	EaselJSGraphics.DrawingBase.prototype[propName] = function _canvas_property_setter_(value) {
		this.addCommand(function(context) {
			context[propName] = value;
		});
		return this;
	}
});

// Custom drawing methods:
_.extend(EaselJSGraphics.DrawingBase.prototype, {
	endPath: function(drawStyle) {
		if (drawStyle.fillStyle) {
			this.fillStyle(drawStyle.fillStyle);
			this.fill();
		}
		if (drawStyle.strokeStyle) {
			this.strokeStyle(drawStyle.strokeStyle);
			this.lineWidth(drawStyle.lineWidth || 1);
			if (drawStyle.lineCap) this.lineCap(drawStyle.lineCap); // "butt", "round", "square"
			if (drawStyle.lineJoin) this.lineJoin(drawStyle.lineJoin); // "miter", "round", "bevel"
			if (drawStyle.miterLimit) this.miterLimit(drawStyle.miterLimit);
			this.stroke();
		}
		return this;
	}
	,roundRect: function(x, y, width, height, radius) {

		var halfPI = Math.PI / 2
			,angle_top = halfPI * 3
			,angle_right = 0
			,angle_bottom = halfPI
			,angle_left = Math.PI;

		var arc_left = x + radius
			,arc_right = x + width - radius
			,arc_top = y + radius
			,arc_bottom = y + height - radius;

		this
			.arc(arc_right, arc_top, radius, angle_top, angle_right)
			.arc(arc_right, arc_bottom, radius, angle_right, angle_bottom)
			.arc(arc_left, arc_bottom, radius, angle_bottom, angle_left)
			.arc(arc_left, arc_top, radius, angle_left, angle_top)
		;

		return this;
	}
	,circle: function(x, y, radius) {
		this.arc(x, y, radius, 0, 2 * Math.PI);
		return this;
	}
	,star: function(x, y, radius, sides, pointSize, angle) {
		if (typeof x === 'object') {
			var options = x;
			x = options.x;
			y = options.y;
			radius = options.radius;
			sides = options.sides;
			pointSize = options.pointSize;
			angle = options.angle;
		}
		if (!x) x = 0;
		if (!y) y = 0;
		if (!pointSize) pointSize = 0;
		if (!angle) angle = 0;

		pointSize = 1-pointSize;
		if (angle == null) { angle = 0; }
		else { angle /= 180/Math.PI; }
		var a = Math.PI/sides;

		this.moveTo(x+Math.cos(angle)*radius, y+Math.sin(angle)*radius);
		for (var i=0; i<sides; i++) {
			angle += a;
			if (pointSize != 1) {
				this.lineTo(x+Math.cos(angle)*radius*pointSize, y+Math.sin(angle)*radius*pointSize);
			}
			angle += a;
			this.lineTo(x+Math.cos(angle)*radius, y+Math.sin(angle)*radius);
		}
		return this;
	}
	,polygon: function(points, leaveOpen) {
		var startX = points[0][0], startY = points[0][1];
		this.moveTo(startX, startY);
		for (var i = 1, l = points.length; i < l; i++) {
			var x = points[i][0], y = points[i][1];
			this.lineTo(x, y);
		}
		if (!leaveOpen)
			this.lineTo(startX, startY);

		return this;
	}
	,drawingQueue: function(drawingQueue) {
		this.addCommand(function(context) {
			drawingQueue.draw(context);
		});
	}
});

/**
 * A Drawing Helper that immediately draws to the supplied canvas context.
 */
EaselJSGraphics.DrawingContext = Smart.Class(new EaselJSGraphics.DrawingBase(), {
	initialize: function Drawing(context) {
		this.context = context;
	}
	,addCommand: function(command) {
		command(this.context);
	}
});
/**
 * A Drawing Helper that queues and caches the shapes, to be drawn
 */
EaselJSGraphics.DrawingQueue = Smart.Class(new EaselJSGraphics.DrawingBase(), {
	initialize: function DrawingQueue() {
		this._commands = [];
	}
	,addCommand: function(command) {
		this._commands.push(command);
	}
	,draw: function(context) {
		this._commands.forEach(function(command) {
			command(context);
		});
	}
	,clear: function() {
		this._commands.length = 0;
	}
});
