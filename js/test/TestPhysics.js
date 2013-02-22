var TestPhysics = {
	test: function() {
		this.sortingShouldSortLeftToRight();
		this.sortingShouldSortLeftToRightAndIgnoresY();
	}
	,
	sortingShouldSortLeftToRight: function() {
		TestPhysics.testSortResults(
			 [[3,3],[2,2],[1,1]]
			,[[1,1],[2,2],[3,3]]
		);
	}
	,
	sortingShouldSortLeftToRightAndIgnoresY: function() {
		TestPhysics.testSortResults(
			 [[3,1],[2,2],[1,3]]
			,[[1,3],[2,2],[3,1]]
		);
	}
	,
	testSortResults: function(inputPoints, expectedPoints) {
		inputPoints = TestPhysicsHelper.getPoints(inputPoints);
		expectedPoints = TestPhysicsHelper.getPoints(expectedPoints);

		var sortedPoints = Physics.sortPoints(inputPoints);

		TestPhysicsHelper.assertPointsAreEqual(sortedPoints, expectedPoints);
	}
};

var TestPhysicsHelper = {
	assertPointsAreEqual: function(actualPoints, expectedPoints) {
		actualPoints = TestPhysicsHelper.pointsToString(actualPoints);
		expectedPoints = TestPhysicsHelper.pointsToString(expectedPoints);
		TestFramework.assertEqual(actualPoints, expectedPoints);
	}
	,
	getPoints: function(arrays) {
		return Array.map(arrays, function(array) {
			return {x:array[0],y:array[1]};
		});
	}
	,
	pointsToString: function(points) {
		var results = Array.map(points, function(p) {
			return String.substitute("[{x},{y}]", p);
		});
		return results.join(",");
	}
};

var TestFramework = {
	assertEqual: function(actual, expected) {
		if (actual !== expected) {
			console.error("Expected: ", expected, " but got: ", actual);
		}
	}
};