(function() {
	
	Smart.Color = {
		parseRGB: function(color) {
			if (typeof color !== 'string') return null;
			
			color = color.replace(/\s+/g, "");
			
			var hex6 = color.match(/^#?([A-Fa-f0-9]{2})([A-Fa-f0-9]{2})([A-Fa-f0-9]{2})$/);
			if (hex6)
				return hex6.slice(1).map(function(h) { return parseInt(h, 16); });
			
			var hex3 = color.match(/^#?([A-Fa-f0-9])([A-Fa-f0-9])([A-Fa-f0-9])$/);
			if (hex3)
				return hex3.slice(1).map(function(h) { return parseInt(h, 16); });
			
			var rgba = color.match(/^rgba?\((\d{1,3}),(\d{1,3}),(\d{1,3})(?:,(\d?\.?\d*))?\)$/);
			if (rgba)
				return rgba.slice(1, (rgba[4] ? 5 : 4)).map(function(d) { return parseFloat(d); });
			
			return null;
		}
		,
		toRGB: function(array){
			if (array.length === 4)
				return "rgba(" + str(array[0], 0, 255, 0) 
						+ "," + str(array[1], 0, 255, 0) 
						+ "," + str(array[2], 0, 255, 0) 
						+ "," + str(array[3], 0, 1, 2) + ")";
			if (array.length === 3)
				return "rgb(" + str(array[0], 0, 255, 0) 
						+ "," + str(array[1], 0, 255, 0) 
						+ "," + str(array[2], 0, 255, 0) + ")";

			return null;
		}
		,
		parseHSL: function(color) {
			if (typeof color !== 'string') return null;
			
			color = color.replace(/\s+/g, "");
			
			var hsla = color.match(/^hsla?\((\d{1,3}),(\d{1,3})%,(\d{1,3})%(?:,(\d?\.?\d*))?\)$/);
			if (hsla)
				return hsla.slice(1, (hsla[4] ? 5 : 4)).map(function(d) { return parseFloat(d); });
			
			return null;
		}
		,
		toHSL: function(array) {
			var hue = array[0];
			if (hue < 0)
				hue = 360 - (-hue % 360);
			else if (hue >= 360)
				hue = hue % 360;
			
			if (array.length === 4)
				return "hsla(" + hue.toFixed(0)
						+ "," + str(array[1], 0, 100, 0)
						+ "%," + str(array[2], 0, 100, 0)
						+ "%," + str(array[3], 0, 1, 2)
						+ ")";
			if (array.length === 3)
				return "hsl(" + hue.toFixed(0)
						+ "," + str(array[1], 0, 100, 0)
						+ "%," + str(array[2], 0, 100, 0)
						+ "%)";
			
			return null;
		}
	};
	
	_.extend(Smart.Color, {
		_shift: function(hslColor, amount, hslaIndex) {
			hslColor = Smart.Color.parseHSL(hslColor);
			hslColor[hslaIndex] += amount;
			return Smart.Color.toHSL(hslColor);
		},
		darken: function(hslColor, darkenPct) {
			return this._shift(hslColor, -darkenPct, 2);
		}
		,
		lighten: function(hslColor, lightenPct) {
			return this._shift(hslColor, lightenPct, 2);
		}
		,
		spin: function(hslColor, spinAmt) {
			return this._shift(hslColor, spinAmt, 0);
		}
		,
		saturate: function(hslColor, saturateAmt) {
			return this._shift(hslColor, saturateAmt, 1);
		}
		,
		desaturate: function(hslColor, desaturateAmt) {
			return this._shift(hslColor, -desaturateAmt, 1);
		}
	});
	
	function str(number, min, max, decimalPoints) {
		if (number < min) number = min;
		else if (number > max) number = max;
		return number.toFixed(decimalPoints);
	}
	
})();
	