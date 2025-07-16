export const Color = {
	parseRGB(color) {
		if (typeof color !== 'string') return null;

		color = color.replace(/\s+/g, "");

		var hex6 = color.match(/^#?([A-Fa-f0-9]{2})([A-Fa-f0-9]{2})([A-Fa-f0-9]{2})$/);
		if (hex6)
			return hex6.slice(1).map(h => parseInt(h, 16));

		var hex3 = color.match(/^#?([A-Fa-f0-9])([A-Fa-f0-9])([A-Fa-f0-9])$/);
		if (hex3)
			return hex3.slice(1).map(h => parseInt(h, 16));

		var rgba = color.match(/^rgba?\((\d{1,3}),(\d{1,3}),(\d{1,3})(?:,(\d?\.?\d*))?\)$/);
		if (rgba)
			return rgba.slice(1, (rgba[4] ? 5 : 4)).map(d => parseFloat(d));

		return null;
	},

	toRGB(array) {
		if (!(array.length === 3 || array.length === 4)) return null;

		var r = str(array[0], 0, 255, 0);
		var g = str(array[1], 0, 255, 0);
		var b = str(array[2], 0, 255, 0);
		if (array.length === 4 && array[3] !== 1) {
			var a = str(array[3], 0, 1, 2);
			return `rgba(${r},${g},${b},${a})`;
		} else {
			return `rgb(${r},${g},${b})`;
		}
	},

	parseHSL(color) {
		if (typeof color !== 'string') return null;

		color = color.replace(/\s+/g, "");

		var hsla = color.match(/^hsla?\((\d{1,3}),(\d{1,3})%,(\d{1,3})%(?:,(\d?\.?\d*))?\)$/);
		if (hsla)
			return hsla.slice(1, (hsla[4] ? 5 : 4)).map(d => parseFloat(d));

		return null;
	},

	toHSL(array) {
		if (!(array.length === 3 || array.length === 4)) return null;

		var hue = array[0];
		if (hue < 0)
			hue = 360 - (-hue % 360);
		else if (hue >= 360)
			hue = hue % 360;

		hue = hue.toFixed(0);
		var sat = str(array[1], 0, 100, 0);
		var lum = str(array[2], 0, 100, 0);

		if (array.length === 4) {
			var alpha = str(array[3], 0, 1, 2);
			return `hsla(${hue},${sat}%,${lum}%,${alpha})`;
		} else {
			return `hsl(${hue},${sat}%,${lum}%)`;
		}
	},

	_shift(hslColor, amount, hslaIndex) {
		hslColor = Color.parseHSL(hslColor);
		hslColor[hslaIndex] += amount;
		return Color.toHSL(hslColor);
	},
	darken(hslColor, darkenPct) {
		return this._shift(hslColor, -darkenPct, 2);
	},

	lighten(hslColor, lightenPct) {
		return this._shift(hslColor, lightenPct, 2);
	},

	spin(hslColor, spinAmt) {
		return this._shift(hslColor, spinAmt, 0);
	},

	saturate(hslColor, saturateAmt) {
		return this._shift(hslColor, saturateAmt, 1);
	},

	desaturate(hslColor, desaturateAmt) {
		return this._shift(hslColor, -desaturateAmt, 1);
	}
};

function str(number, min, max, decimalPoints) {
	if (number < min) number = min;
	else if (number > max) number = max;
	return number.toFixed(decimalPoints);
}
