describe("Smart.Color", function() {
	describe("parseRGB", function() {
		var parseRGB = Smart.Color.parseRGB;
		
		it("should parse hex codes", function() {
			expect(parseRGB('#000000')).toEqual([ 0, 0, 0 ]);
			expect(parseRGB('#FFFFFF')).toEqual([ 255, 255, 255 ]);
			expect(parseRGB('#FFFF00')).toEqual([ 255, 255, 0 ]);
			expect(parseRGB('#FF0000')).toEqual([ 255, 0, 0 ]);
			expect(parseRGB('#0000FF')).toEqual([ 0, 0, 255 ]);
		});
		it("should parse valid rgb and rgba colors", function() {
			expect(parseRGB('rgb(255, 255, 255)')).toEqual([ 255, 255, 255 ]);
			expect(parseRGB('rgb(0, 0, 0)')).toEqual([ 0, 0, 0 ]);
			expect(parseRGB(' rgb ( 0 , 0 , 0 ) ')).toEqual([ 0, 0, 0 ]);

			expect(parseRGB('rgba(255, 255, 255, 0)')).toEqual([ 255, 255, 255, 0 ]);
			expect(parseRGB('rgba(255, 255, 255, 1)')).toEqual([ 255, 255, 255, 1 ]);
			expect(parseRGB('rgba(255, 255, 255, 0.0000)')).toEqual([ 255, 255, 255, 0 ]);
			expect(parseRGB('rgba(255, 255, 255, 0.0001)')).toEqual([ 255, 255, 255, 0.0001 ]);
			expect(parseRGB('rgba(255, 255, 255, 0.1)')).toEqual([ 255, 255, 255, 0.1 ]);
			expect(parseRGB('rgba(255, 255, 255, .1)')).toEqual([ 255, 255, 255, .1 ]);
			expect(parseRGB('rgba(255, 255, 255, 1.0)')).toEqual([ 255, 255, 255, 1 ]);
			expect(parseRGB('rgba(255, 255, 255, 1.0000)')).toEqual([ 255, 255, 255, 1 ]);
			expect(parseRGB(' rgba ( 0 , 0 , 0 , 1 ) ')).toEqual([ 0, 0, 0, 1 ]);
		});
		it("should not parse extra-invalid rgb() colors", function() {
			// Note: not all rgb colors are validated;  
			expect(parseRGB('rgb(9999, 0, 0)')).toEqual(null);
			expect(parseRGB('rgb(0, 0)')).toEqual(null);
			expect(parseRGB('RGB(0, 0, 0)')).toEqual(null);
			expect(parseRGB('rgba(0, 0, 0, 0, 0)')).toEqual(null);
		});
	});
	describe("toRGB", function() {
		var toRGB = Smart.Color.toRGB;
		it("should return rgb and rgba colors", function() {
			expect(toRGB([ 255, 255, 255 ])).toBe('rgb(255,255,255)');
			expect(toRGB([ 0, 0, 0 ])).toBe('rgb(0,0,0)');
			expect(toRGB([ 0, 0, 255 ])).toBe('rgb(0,0,255)');
			expect(toRGB([ 255, 0, 255 ])).toBe('rgb(255,0,255)');
			
			expect(toRGB([ 255, 255, 255, 0 ])).toBe('rgba(255,255,255,0.00)');
			expect(toRGB([ 255, 255, 255, 0.001 ])).toBe('rgba(255,255,255,0.00)');
			expect(toRGB([ 255, 255, 255, 0.01 ])).toBe('rgba(255,255,255,0.01)');
			expect(toRGB([ 255, 255, 255, 0.1 ])).toBe('rgba(255,255,255,0.10)');
			expect(toRGB([ 255, 255, 255, 0.99 ])).toBe('rgba(255,255,255,0.99)');
			expect(toRGB([ 255, 255, 255, 0.999 ])).toBe('rgba(255,255,255,1.00)');
		});
		it("should validate and cap the values", function() {
			expect(toRGB([ 256, 300, 9999999 ])).toBe('rgb(255,255,255)');
			expect(toRGB([ -1, -300, -999999 ])).toBe('rgb(0,0,0)');
			
			expect(toRGB([ 256, 256, 256, 1.1 ])).toBe('rgba(255,255,255,1.00)');
			expect(toRGB([ -1, -1, -1, -1 ])).toBe('rgba(0,0,0,0.00)');
		});
	});
});