angular.module('common').directive('commonFillParent', [
	'$window', function($window) {
		var canvasIsWiderThanParent = function(element, parent) {
			var naturalRatio = element.width / element.height,
				parentRatio = parent.offsetWidth / parent.offsetHeight;
			return naturalRatio >= parentRatio;
		};
		return function($scope, $element, $attrs) {
			var resizeElement = function() {
				var $parent = $element.parent();
				if (canvasIsWiderThanParent($element[0], $parent[0])) {
					$element.css({ width: '100%', height: null });
				} else {
					$element.css({ width: null, height: '100%' });
				}
			};
			angular.element($window).bind('resize', resizeElement);
			$attrs.$observe('width', resizeElement);
			$attrs.$observe('height', resizeElement);
			resizeElement();
		}
	}
]);
