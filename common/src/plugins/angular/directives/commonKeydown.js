angular.module('common').directive('commonKeydown', ['$parse', function($parse) {

	var keyCodes = getKeyCodes();

	return function commonKeydown($scope, $element, $attrs) {
		var parsedCache = {};

		var commonKeydownAttr = $attrs['commonKeydown'];
		if (commonKeydownAttr === 'document') {
			$element = angular.element(document);
		}

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

		var keyName = keyCodes[event.keyCode] || event.keyIdentifier || String.fromCharCode(event.keyCode) || 'unknown';
		keyName = keyName.toLowerCase();

		event.keyName = keyName;
		return keyName;
	}
	function getKeyCodes() {
		return {
			'13': 'enter'
			,'27': 'escape'
			,'32': 'space'

			// Special keys:
			,'193'	:	'fire'
			,'194'	:	'fire'
			,'195'	:	'fire'
			,'196'	:	'fire'
			,'197'	:	'fire'
			,'198'	:	'fire'
			,'199'	:	'fire'
			,'200'	:	'fire'
			,'201'	:	'up'
			,'202'	:	'down'
			,'203'	:	'left'
			,'204'	:	'right'
			,'205'	:	'pause'
			,'206'	:	'pause'
			,'207'	:	'fire'
			,'208'	:	'fire'
			,'209'	:	'up'
			,'210'	:	'down'
			,'211'	:	'right'
			,'212'	:	'left'
			,'213'	:	'up'
			,'214'	:	'down'
			,'215'	:	'right'
			,'216'	:	'left'
		};
	}
}]);
