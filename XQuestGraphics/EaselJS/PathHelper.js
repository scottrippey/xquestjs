EaselJSGraphics.PathHelper = Smart.Class({
	initialize: function(context) {
		if (context) {
			this._command = function call_immediately(command) {
				command(context);
			};
		} else {
			var commands = [];
			this._command = function queue_command(command) {
				commands.push(command);
			};
			this.draw = function(context) {
				commands.forEach(function(command) { 
					command(context);
				});
			};
		}
	}
	,_command: null // Initialized in constructor
	,draw: null // Initialized in constructor
	
	,style: function(styles) {
		for (var style in styles) {
			if (!styles.hasOwnProperty(style)) continue;
			this[style](styles[style]);
		}
		return this;
	}
	,clearStyle: function() {
		return this.strokeStyle(null).fillStyle(null);
	}
	,circle: function(x, y, radius) {
		this.arc(x, y, radius, 0, 2 * Math.PI);
		return this;
	}
	,star: function(x, y, radius, sides, pointSize, angle) {
		if (pointSize == null) { pointSize = 0; }
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
});
// Native canvas methods to proxy:
['moveTo', 'lineTo', 'arc', 'arcTo', 'quadraticCurveTo', 'bezierCurveTo', 'rect'].forEach(function(methodName) {
	EaselJSGraphics.PathHelper.prototype[methodName] = function _canvas_method_() {
		var methodArgs = arguments;
		this._command(function(context) {
			context[methodName].apply(context, methodArgs);
		});
		return this;
	}
});
// Native canvas properties; create setters:
['strokeStyle', 'fillStyle', 'lineWidth', 'lineCap', 'lineJoin', 'miterLimit'].forEach(function(propName) {
	EaselJSGraphics.PathHelper.prototype[propName] = function _canvas_property_setter_(value) {
		this._command(function(context) {
			context[propName] = value;
		});
		return this;
	}
});