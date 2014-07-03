describe("Smart.Interpolate", function() {
	describe("Smart.Interpolate.numbers", function() {
		
		var interpolate = Smart.Interpolate.numbers(100, 200);
		
		it("should return a function that accepts 1 parameter", function() {
			expect(typeof interpolate).toBe('function');
			expect(interpolate.length).toBe(1);
		});
		
		it("should interpolate between positive values", function() {
			expect(interpolate(0.00)).toBe(100);
			expect(interpolate(0.25)).toBe(125);
			expect(interpolate(0.50)).toBe(150);
			expect(interpolate(0.75)).toBe(175);
			expect(interpolate(1.00)).toBe(200);
		});
		
	});
});