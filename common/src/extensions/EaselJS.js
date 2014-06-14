
_.extend(createjs.Graphics.prototype, {
	beginStyle: function(styles) {
		var gfx = this;
		if (styles.fillColor)
			gfx.beginFill(styles.fillColor);
		if (styles.strokeColor)
			gfx.beginStroke(styles.strokeColor);

		if (styles.strokeWidth)
			gfx.setStrokeStyle(styles.strokeWidth, styles.strokeCaps, styles.strokeJoints, styles.strokeMiter);

		return this;
	}
	,
	endStyle: function(styles) {
		var gfx = this;
		if (styles.fillColor)
			gfx.endFill();
		if (styles.strokeColor)
			gfx.endStroke();

		return this;
	}
	,
	drawPolygon: function(points) {
		var gfx = this;
		var startX = points[0][0], startY = points[0][1];
		gfx.moveTo(startX, startY);
		for (var i = 1, l = points.length; i < l; i++) {
			var x = points[i][0], y = points[i][1];
			gfx.lineTo(x, y);
		}
		gfx.lineTo(startX, startY);

		return this;
	}
});

_.extend(createjs.DisplayObject.prototype, {
	moveTo: function(x, y) {
		this.x = x; this.y = y;
	}
	,
	scaleTo: function(x, y) {
		if (y === undefined) y = x;
		this.scaleX = x;
		this.scaleY = y;
	}
	,
	toggleVisible: function(force) {
		if (force === undefined) force = !this.visible;
		this.visible = force;
	}
	,
	// TODO: Move this to Smart.Physics
	alignWith: function(vector) {
		this.rotation = 180 - Math.atan2(vector.x, vector.y) / (Math.PI / 180);
	}
	,
	dispose: function() {
		console.assert(this._onDispose !== null, "Object is already disposed!");

		if (this._onDispose) {
			this._onDispose.forEach(function(callback) {
				callback.call(this, this);
			}, this);
			this._onDispose = null;
		}
	}
	,
	/**
	 * Adds a "cleanup" handler that will be called when `dispose` is called.
	 * @param {Function} callback
	 */
	onDispose: function(callback) {
		console.assert(this._onDispose !== null, "Object is already disposed!");

		if (this._onDispose === undefined)
			this._onDispose = [ callback ];
		else
			this._onDispose.push(callback);
	}

});

