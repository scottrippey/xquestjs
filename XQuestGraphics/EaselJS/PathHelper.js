EaselJSGraphics.PathHelper = Smart.Class({
	initialize: function(ctx) {
		if (ctx) this.ctx = ctx;
		else this.commands = [];
	}
	,drawTo: function(ctx, style) {
		this.beginStyle(style);
		this.drawPath(ctx);
		this.endStyle(style);
	}
	,drawPath: function(ctx) {
		for (var i = 0, l = this.commands.length; i < l; i++) {
			this.commands[i](ctx);
		}
	}

	,beginStyle: function(styles) {
		for (var style in styles) {
			if (!styles.hasOwnProperty(style)) continue;
			this[style](styles[style])
		}
	}
	,endStyle: function() {
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
	,polygon: function(points) {
		var startX = points[0][0], startY = points[0][1];
		this.moveTo(startX, startY);
		for (var i = 1, l = points.length; i < l; i++) {
			var x = points[i][0], y = points[i][1];
			this.lineTo(x, y);
		}
		this.lineTo(startX, startY);

		return this;
	}

});
// Native canvas methods to proxy:
['moveTo', 'lineTo', 'arc', 'arcTo', 'quadraticCurveTo', 'bezierCurveTo', 'rect'].forEach(function(methodName) {
	EaselJSGraphics.PathHelper.prototype[methodName] = function _canvas_method_() {
		var methodArgs = arguments;
		if (this.ctx) {
			this.ctx[methodName].apply(this.ctx, methodArgs);
		} else {
			this.commands.push(function _pathCommand(ctx) {
				ctx[methodName].apply(ctx, methodArgs);
			});
		}
		return this;
	}
});
// Native canvas properties; create setters:
['strokeStyle', 'fillStyle', 'lineWidth', 'lineCap', 'lineJoin', 'miterLimit'].forEach(function(propName) {
	EaselJSGraphics.PathHelper.prototype[propName] = function _canvas_property_(value) {
		if (this.ctx) {
			this.ctx[propName] = value;
		} else {
			this.commands.push(function(ctx) {
				ctx[propName] = value;
			});
		}
		return this;
	}
});