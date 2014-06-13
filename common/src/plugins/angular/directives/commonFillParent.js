angular.module('common').directive('commonFillParent', [
	'$window', function($window) {
		var elementIsWiderThanParent = function(element, parent) {
			var naturalRatio = element.width / element.height,
				parentRatio = parent.offsetWidth / parent.offsetHeight;
			return naturalRatio >= parentRatio;
		};
		return function($scope, $element, $attrs) {
			var resizeElement = function() {
				var $parent = $element.parent();
				if (elementIsWiderThanParent($element[0], $parent[0])) {
					$element.css({ width: '100%', height: null });
				} else {
					$element.css({ width: null, height: '100%' });
				}
			};
			angular.element($window).bind('resize', resizeElement);
			resizeElement();
		}
	}
]);
