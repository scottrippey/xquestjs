angular.module('common').directive('commonKeydown', ['$parse', function($parse) {
	return function commonKeydown($scope, $element, $attrs) {
		var parsedCache = {};
		$element.on('keydown', function(event) {
			var keyName = addKeyName(event)
				, handler = parsedCache[keyName];
			if (handler === undefined) {
				var KeyName = (keyName.charAt(0).toUpperCase()) + (keyName.substr(1))
					, attrName = 'commonKeydown' + KeyName
					, attr = $attrs[attrName];
				handler = (attr === undefined) ? null : $parse(attr);
				parsedCache[keyName] = handler;
			}

			if (handler) {
				$scope.$apply(function() {
					handler($scope, { $event: event, keyName: keyName });
				});
			}
		});
	};
	function addKeyName(event) {
		switch (event.keyCode) {
			case 27:
				event.keyName = 'escape';
				break;
			default:
				event.keyName = (event.keyIdentifier || String.fromCharCode(event.keyCode) || 'unknown key');
				break;
		}

		return event.keyName;
	}
}]);
