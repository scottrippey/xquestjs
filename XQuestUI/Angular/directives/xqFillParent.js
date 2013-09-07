angular.module('XQuestUI').directive('xqFillParent', [
	'$window', function($window) {
		var fill = function(elementWidth, elementHeight, parentWidth, parentHeight) {
			var elRatio = elementWidth / elementHeight;
			var parentRatio = parentWidth / parentHeight;

			if (elRatio >= parentRatio) {
				return {
					width: parentWidth
					, height: parentWidth / elRatio
				};
			} else {
				return {
					width: parentHeight * elRatio
					, height: parentHeight
				};
			}
		};
		return function($scope, $element, $attrs) {
			var resizeElement = function() {
				var $parent = $element.parent();
				var size = fill($element[0].width, $element[0].height, $parent[0].offsetWidth, $parent[0].offsetHeight);
				$element.css({ width: size.width + 'px', height: size.height + 'px' });
			};
			angular.element($window).bind('resize', resizeElement);
			resizeElement();
		}
	}
]);
