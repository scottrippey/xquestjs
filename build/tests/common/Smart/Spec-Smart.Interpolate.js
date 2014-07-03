describe("Smart.Interpolate", function() {
	describe("Smart.Interpolate.numbers", function() {
		var interpolate = Smart.Interpolate.numbers(100, 200);
		
		it("should return a function that accepts 1 parameter", function() {
			expect(typeof interpolate).toBe('function');
			expect(interpolate.length).toBe(1);
		});
		
		it("should interpolate between positive values", function() {
			expect([ 0.00, 0.25, 0.50, 0.75, 1.00 ].map(interpolate))
				.toEqual([ 100, 125, 150, 175, 200 ]);
		});

		var interpolateNeg = Smart.Interpolate.numbers(-200, -100);
		it("should interpolate between negative values", function() {
			expect([ 0.00, 0.25, 0.50, 0.75, 1.00 ].map(interpolateNeg))
				.toEqual([ -200, -175, -150, -125, -100 ]);
		});
		
		var interpolateDown = Smart.Interpolate.numbers(200, 100);
		it("should interpolate from high to low", function() {
			expect([ 0.00, 0.25, 0.50, 0.75, 1.00 ].map(interpolateDown))
				.toEqual([ 200, 175, 150, 125, 100 ]);
		});
	});
});