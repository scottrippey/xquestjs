
createjs.Graphics.prototype.beginStyle = function(styles) {
	var gfx = this;
	if (styles.fillColor)
		gfx.beginFill(styles.fillColor);
	if (styles.strokeColor)
		gfx.beginStroke(styles.strokeColor);

	if (styles.strokeWidth)
		gfx.setStrokeStyle(styles.strokeWidth, styles.strokeCaps, styles.strokeJoints, styles.strokeMiter);

	return this;
};
createjs.Graphics.prototype.endStyle = function(styles) {
	var gfx = this;
	if (styles.fillColor)
		gfx.endFill();
	if (styles.strokeColor)
		gfx.endStroke();

	return this;
};