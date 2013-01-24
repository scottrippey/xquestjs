
createjs.Graphics.prototype.beginStyle = function(styles) {
	var gfx = this;
	if (styles.fillColor) {
		gfx.beginFill(styles.fillColor);
	}
	if (styles.strokeWidth && styles.strokeColor)
		gfx.beginStroke(styles.strokeWidth, styles.strokeColor);
	else if (styles.strokeWidth)
		gfx.beginStroke(styles.strokeWidth);

	return this;
};