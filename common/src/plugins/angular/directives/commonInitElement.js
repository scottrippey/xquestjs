angular.module('common').directive('commonInitElement', [
	'$parse', function($parse) {

		return function commonInitElement($scope, $element, $attrs) {

			var expression = $attrs['commonInitElement'];
			var expressionFn = $parse(expression);

			var parameters = {
				element: $element[0]
				, $element: $element
			};

			expressionFn($scope, parameters);
		}
	}
]);
