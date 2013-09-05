angular.module('XQuestUI').directive('xqInitElement', [
	'$parse', function($parse) {

		return function xqInitElement($scope, $element, $attrs) {

			var expression = $attrs['xqInitElement'];
			var expressionFn = $parse(expression);

			var parameters = {
				element: $element[0]
				, $element: $element
			};

			expressionFn($scope, parameters);
		}
	}
]);