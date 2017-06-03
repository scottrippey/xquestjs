/**
 * Smart.Drawing
 *
 * A wrapper around a CanvasRenderingContext2D,
 * providing a chainable syntax and shape helper methods.
 *
 */
Smart.Drawing = Smart.Class({
	initialize: function Drawing() {},
	addCommand: null // Must be overridden
});

(function Drawing_native_canvas() {
	/**
	 * The following is a list of native canvas context methods.
	 * We will create chainable proxies for each method.
	 *
	 * Note: None of these methods have return values; we do not want things like "measureText" to appear here.
	 */
	var canvasMethods = [
		'moveTo', 'lineTo', 'arc', 'arcTo', 'quadraticCurveTo', 'bezierCurveTo'
		, 'beginPath', 'closePath'
		, 'fill', 'stroke'
		, 'rect', 'fillRect', 'strokeRect', 'clearRect'
		, 'fillText', 'strokeText'
		, 'scale', 'rotate', 'translate', 'transform'
		, 'drawImage'
		, 'save', 'restore'
	];
	/**
	 * The following is a list of native canvas properties.
	 * We will create chainable setters for each property:
	 */
	var canvasProperties = [
		'strokeStyle', 'fillStyle', 'lineWidth', 'lineCap', 'lineJoin', 'miterLimit'
		, 'font'
	];
	canvasMethods.forEach(methodName => {
		Smart.Drawing.prototype[methodName] = function _canvas_method_() {
			var methodArgs = arguments;
			this.addCommand(context => {
				context[methodName].apply(context, methodArgs);
			});
			return this;
		}
	});

	canvasProperties.forEach(propName => {
		Smart.Drawing.prototype[propName] = function _canvas_property_setter_(value) {
			this.addCommand(context => {
				context[propName] = value;
			});
			return this;
		}
	});
})();

(function Drawing_custom_methods() {
	/**
	 * Custom drawing helper methods, for drawing shapes and patterns
	 */
	_.extend(Smart.Drawing.prototype, {
		/**
		 * Fills and/or strokes a path.
		 *
		 * @param {object} drawStyle
		 * @param {DrawStyle} drawStyle.fillStyle
		 * @param {DrawStyle} drawStyle.strokeStyle
		 * @param {number} [drawStyle.lineWidth]
		 * @param {LineCap} [drawStyle.lineCap] - "butt", "round", "square"
		 * @param {LineJoin} [drawStyle.lineJoin] - "miter", "round", "bevel"
		 * @param {number} [drawStyle.miterLimit]
		 *
		 * @return {Smart.Drawing}
		 */
		endPath(drawStyle) {
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
		,roundRect(x, y, width, height, radius) {

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
				.lineTo(arc_right, y)
			;

			return this;
		}
		,circle(x, y, radius) {
			this.arc(x, y, radius, 0, 2 * Math.PI);
			return this;
		}
		,star(x, y, radius, sides, pointSize, angle) {
			var starPolygon = Smart.Drawing.createStarPolygon(x, y, radius, sides, pointSize, angle);
			this.polygon(starPolygon, false);
			return this;
		}
		,polygon(points) {
			var start = points[0];
			this.moveTo(start[0], start[1]);
			for (var i = 1, l = points.length; i < l; i++) {
				var point = points[i];
				this.lineTo(point[0], point[1]);
			}
			return this;
		}
		,drawingQueue(drawingQueue) {
			this.addCommand(context => {
				drawingQueue.draw(context);
			});
			return this;
		}
		,fillPattern(pattern, x, y, width, height, patternOffsetX, patternOffsetY) {
			if (patternOffsetX && patternOffsetY) {
				this.save()
					.translate(patternOffsetX, patternOffsetY)
					.fillStyle(pattern)
					.fillRect(x - patternOffsetX, y - patternOffsetY, width, height)
					.restore();
			} else {
				this.fillStyle(pattern)
					.fillRect(x, y, width, height);
			}
			return this;
		}
	});

})();

(function Drawing_static_methods() {
	_.extend(Smart.Drawing, {
		/**
		 * Creates a star with the specified number of sides.
		 *
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} radius
		 * @param {Number} sides
		 * @param {Number} pointSize
		 * @param {Number} angle
		 * @returns {Array}
		 */
		createStarPolygon(x, y, radius, sides, pointSize, angle) {
			if (typeof x === 'object') {
				var options = x;
				x = options.x;
				y = options.y;
				radius = options.radius;
				sides = options.sides;
				pointSize = options.pointSize;
				angle = options.angle;
			}
			if (!radius || !sides) return null;
			if (!x) x = 0;
			if (!y) y = 0;
			if (!pointSize) pointSize = 0;
			if (!angle) angle = 0;

			pointSize = 1-pointSize;

			angle /= 180/Math.PI;

			var a = Math.PI/sides;

			var starPolygon = [];
			for (var i=0; i<sides; i++) {
				angle += a;
				if (pointSize != 1) {
					starPolygon.push([ x+Math.cos(angle)*radius*pointSize, y+Math.sin(angle)*radius*pointSize ]);
				}
				angle += a;
				starPolygon.push([ x+Math.cos(angle)*radius, y+Math.sin(angle)*radius ]);
			}
			return starPolygon;
		}
		,
		/**
		 * Creates a polygon around the edges of a circle, connecting the specified angles.
		 * For example, [ 0, 120, 240 ] would create an equilateral triangle,
		 * and [ 0, 20, 180, 340 ] would create a kite-like shape.
		 *
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} radius
		 * @param {Number[]} angles
		 * @returns {Array}
		 */
		polygonFromAngles(x, y, radius, angles) {
			var polygon = [];
			var ANGLE_ADJUST = 90,
				RAD_PER_DEG = Math.PI / -180;
			for (var i = 0, l = angles.length; i < l; i++) {
				var angle = (angles[i] + ANGLE_ADJUST) * RAD_PER_DEG
					, px = Math.cos(angle) * radius
					, py = Math.sin(angle) * radius;
				polygon.push([ px + x, py + y ]);
			}
			return polygon;
		}
		,
		createImage(width, height, drawingCallback) {
			var canvas = this._createCanvas(width, height);
			var context = canvas.getContext('2d');
			var drawing = new Smart.DrawingContext(context);

			drawingCallback(drawing);

			return canvas;
		}
		,
		createPattern(width, height, drawingCallback) {
			var canvas = this._createCanvas(width, height);
			var context = canvas.getContext('2d');
			var drawing = new Smart.DrawingContext(context);

			drawingCallback(drawing);

			var pattern = context.createPattern(canvas, 'repeat');
			return pattern;
		}
		,
		_createCanvas(width, height) {
			var canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;
			return canvas;
		}
	});
})();


/**
 * A Drawing Helper that immediately draws to the supplied canvas context.
 */
Smart.DrawingContext = Smart.Class(new Smart.Drawing(), {
	initialize: function DrawingContext(context) {
		this.context = context;
	}
	,addCommand(command) {
		command(this.context);
	}
	,setContext(context) {
		this.context = context;
	}
});

/**
 * A Drawing Helper that queues and caches the shapes, to be drawn
 */
Smart.DrawingQueue = Smart.Class(new Smart.Drawing(), {
	initialize: function DrawingQueue() {
		this._commands = [];
	}
	,addCommand(command) {
		this._commands.push(command);
	}
	,draw(context) {
		this._commands.forEach(command => {
			command(context);
		});
	}
	,clear() {
		this._commands.length = 0;
	}
});
