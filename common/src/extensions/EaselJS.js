_.extend(createjs.Graphics.prototype, {
	beginStyle(styles) {
		var gfx = this;
		if (styles.fillColor)
			gfx.beginFill(styles.fillColor);
		if (styles.strokeColor)
			gfx.beginStroke(styles.strokeColor);

		if (styles.strokeWidth)
			gfx.setStrokeStyle(styles.strokeWidth, styles.strokeCaps, styles.strokeJoints, styles.strokeMiter);

		return this;
	},
	endStyle(styles) {
		var gfx = this;
		if (styles.fillColor)
			gfx.endFill();
		if (styles.strokeColor)
			gfx.endStroke();

		return this;
	},
	drawPolygon(points) {
		var gfx = this;
		var startX = points[0][0];
		var startY = points[0][1];
		gfx.moveTo(startX, startY);
		for (var i = 1, l = points.length; i < l; i++) {
			var x = points[i][0];
			var y = points[i][1];
			gfx.lineTo(x, y);
		}
		gfx.lineTo(startX, startY);

		return this;
	}
});

_.extend(createjs.DisplayObject.prototype, Smart.Disposable.prototype);
_.extend(createjs.DisplayObject.prototype, {
	moveTo(x, y) {
		this.x = x;
		this.y = y;
	},
	scaleTo(x, y) {
		if (y === undefined) y = x;
		this.scaleX = x;
		this.scaleY = y;
	},
	toggleVisible(force) {
		if (force === undefined) force = !this.visible;
		this.visible = force;
	}
});

