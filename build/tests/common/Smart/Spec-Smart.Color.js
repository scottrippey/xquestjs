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
});