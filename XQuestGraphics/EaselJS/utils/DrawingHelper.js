EaselJSGraphics.DrawingBase = Smart.Class({
	addCommand: null // Must be overridden
});

(function DrawingBase_native_canvas() {
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
	];
	canvasMethods.forEach(function(methodName) {
		EaselJSGraphics.DrawingBase.prototype[methodName] = function _canvas_method_() {
			var methodArgs = arguments;
			this.addCommand(function(context) {
				context[methodName].apply(context, methodArgs);
			});
			return this;
		}
	});

	canvasProperties.forEach(function(propName) {
		EaselJSGraphics.DrawingBase.prototype[propName] = function _canvas_property_setter_(value) {
			this.addCommand(function(context) {
				context[propName] = value;
			});
			return this;
		}
	});
})();

(function DrawingBase_custom_methods() {
	/**
	 * Custom drawing helper methods, for drawing shapes and patterns
	 */
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
				.lineTo(arc_right, y)
			;

			return this;
		}
		,circle: function(x, y, radius) {
			this.arc(x, y, radius, 0, 2 * Math.PI);
			return this;
		}
		,star: function(x, y, radius, sides, pointSize, angle) {
			var starPolygon = EaselJSGraphics.DrawingBase.createStarPolygon(x, y, radius, sides, pointSize, angle);
			this.polygon(starPolygon, false);
			return this;
		}
		,polygon: function(points) {
			var start = points[0];
			this.moveTo(start[0], start[1]);
			for (var i = 1, l = points.length; i < l; i++) {
				var point = points[i];
				this.lineTo(point[0], point[1]);
			}
			return this;
		}
		,drawingQueue: function(drawingQueue) {
			this.addCommand(function(context) {
				drawingQueue.draw(context);
			});
			return this;
		}
		,fillPattern: function(pattern, x, y, width, height, patternOffsetX, patternOffsetY) {
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

(function DrawingBase_static_methods() {
	_.extend(EaselJSGraphics.DrawingBase, {
		createStarPolygon: function(x, y, radius, sides, pointSize, angle) {
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
		createImage: function(width, height, drawingCallback) {
			var canvas = this._createCanvas(width, height);
			var context = canvas.getContext('2d');
			var drawing = new EaselJSGraphics.DrawingContext(context);

			drawingCallback(drawing);

			return canvas;
		}
		,
		createPattern: function(width, height, drawingCallback) {
			var canvas = this._createCanvas(width, height);
			var context = canvas.getContext('2d');
			var drawing = new EaselJSGraphics.DrawingContext(context);

			drawingCallback(drawing);

			var pattern = context.createPattern(canvas, 'repeat');
			return pattern;
		}
		,
		_createCanvas: function(width, height) {
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
EaselJSGraphics.DrawingContext = Smart.Class(new EaselJSGraphics.DrawingBase(), {
	initialize: function Drawing(context) {
		this.context = context;
	}
	,addCommand: function(command) {
		command(this.context);
	}
	,setContext: function(context) {
		this.context = context;
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
