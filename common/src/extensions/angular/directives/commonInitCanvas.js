angular.module('common').directive('commonInitCanvas', [
	'$parse', function($parse) {

		return function commonInitCanvas($scope, $element, $attrs) {

			var expression = $attrs['commonInitCanvas'];
			var expressionFn = $parse(expression);

			var parameters = {
				canvas: $element[0]
				, $element: $element
			};

			expressionFn($scope, parameters);
		}
	}
]);
