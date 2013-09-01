var TestPhysics = {
	test: function() {
		this.sortingShouldSortLeftToRight();
		this.sortingShouldSortLeftToRightAndIgnoresY();
		this.collisionDetectionFindsAllCollisions();
	}
	,
	sortingShouldSortLeftToRight: function() {
		TestPhysicsHelper.testSortResults(
			 [[3,3],[2,2],[1,1]]
			,[[1,1],[2,2],[3,3]]
		);
	}
	,
	sortingShouldSortLeftToRightAndIgnoresY: function() {
		TestPhysicsHelper.testSortResults(
			 [[3,1],[2,2],[1,3]]
			,[[1,3],[2,2],[3,1]]
		);
	}
	,
	collisionDetectionFindsAllCollisions: function() {
		TestPhysicsHelper.testCollisions(
			 [[10,10],[20,20],[30,30],[34,34],[35,35],[36,36],[50,50]]
			,[[15,15],[19,19],[20,20],[21,21],[35,35],[40,40]]
			,3
			,[[36,36],[35,35],[35,35],[35,35],[34,34],[35,35],[20,20],[21,21],[20,20],[20,20],[20,20],[19,19]]
		);
	}
};

var TestPhysicsHelper = {
	testSortResults: function(inputPoints, expectedPoints) {
		inputPoints = TestPhysicsHelper.getPoints(inputPoints);
		expectedPoints = TestPhysicsHelper.getPoints(expectedPoints);

		var sortedPoints = Physics.sortByLocation(inputPoints);

		TestPhysicsHelper.assertPointsAreEqual(sortedPoints, expectedPoints);
	}
	,
	testCollisions: function(pointsA, pointsB, maxDistance, expectedCollisions) {
		pointsA = TestPhysicsHelper.getPoints(pointsA);
		pointsB = TestPhysicsHelper.getPoints(pointsB);
		expectedCollisions = TestPhysicsHelper.getPoints(expectedCollisions);

		var actualCollisions = [];
		Physics.detectCollisions(pointsA, pointsB, maxDistance, function(pA, pB, iA, iB, d) {
			actualCollisions.push(pA, pB);
		});

		TestPhysicsHelper.assertPointsAreEqual(actualCollisions, expectedCollisions);
	}
	,
	assertPointsAreEqual: function(actualPoints, expectedPoints) {
		actualPoints = TestPhysicsHelper.pointsToString(actualPoints);
		expectedPoints = TestPhysicsHelper.pointsToString(expectedPoints);
		TestFramework.assertEqual(actualPoints, expectedPoints);
	}
	,
	getPoints: function(arrays) {
		return _.map(arrays, function(array) {
			return {location: {x:array[0],y:array[1]} };
		});
	}
	,
	pointsToString: function(points) {
		var results = _.map(points, function(p) {
			return String.substitute("[{x},{y}]", p.location);
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
