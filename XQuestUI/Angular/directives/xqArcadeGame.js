angular.module("XQuestUI").directive("xqArcadeGame", [
	function() {
		return function(scope, element, attrs) {
			var canvasElement = element[0];
			var arcadeGame = new XQuest(canvasElement);
			window.xquest = arcadeGame;
		}
	}
]);
