

angular.module('common').factory('keyCodes', function() {
	var keyCodes = {
		codes: {
			'13': 'enter'
			,'27': 'escape'
			,'32': 'space'

			// Temporary: very special keys:
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
		}
		,
		registerKeyCodes: function(keyCodes) {
			for (var code in keyCodes) {
				if (!keyCodes.hasOwnProperty(code)) continue;

				this.codes[code] = keyCodes[code];
			}
		}
		,
		getKeyName: function(event) {
			var keyName =
				this.codes[event.keyCode]
				|| (event.keyIdentifier && event.keyIdentifier.indexOf('U+') !== 0 && event.keyIdentifier)
				|| String.fromCharCode(event.keyCode)
				|| 'unknown';

			keyName = keyName.toLowerCase();

			event.keyName = keyName;
			return keyName;
		}

	};
	return keyCodes;
});




angular.module('common').directive('commonKeymap', [ 'keyCodes', '$parse', function(keyCodes, $parse) {

	var commonKeymap = {
		link: function($scope, $element, $attrs) {
			// Set up the handlers:
			var getHandlers = commonKeymap.createGetHandlers($attrs);

			// Set up the mapper:
			var mapper = commonKeymap.createMapper($attrs, $scope);

			// The common-keymap-document attribute attaches events to the document instead of the element
			if ('commonKeymapDocument' in $attrs) {
				$element = angular.element(document);
			}

			var downButtons = {};

			$element.on('keydown', function(event) {
				var keyName = keyCodes.getKeyName(event)
					,mappedKeyName = mapper(keyName)
					,handlers = getHandlers(mappedKeyName);

				if (!(keyName in downButtons)) {
					downButtons[keyName] = true;
					if (handlers.down) {
						handlers.down($scope, { $event: event, keyName: keyName, mappedKeyName: mappedKeyName });
					}
				}
				if (handlers.repeat) {
					handlers.repeat($scope, { $event: event, keyName: keyName, mappedKeyName: mappedKeyName });
				}
			});
			$element.on('keyup', function(event) {
				var keyName = keyCodes.getKeyName(event)
					,mappedKeyName = mapper(keyName)
					,handlers = getHandlers(mappedKeyName);

				delete downButtons[keyName];

				if (handlers.up) {
					handlers.up($scope, { $event: event, keyName: keyName, mappedKeyName: mappedKeyName });
				}
			});
		}
		,
		createGetHandlers: function($attrs) {
			var handlersCache = {};
			var getHandlers = function(keyName) {
				if (handlersCache[keyName])
					return handlersCache[keyName];

				var KeyName = (keyName.charAt(0).toUpperCase()) + (keyName.substr(1))
					, attrRepeat = $attrs['commonKeymap' + KeyName]
					, attrRepeat2 = $attrs['commonKeymap' + KeyName + 'Repeat']
					, attrDown = $attrs['commonKeymap' + KeyName + 'Down']
					, attrUp = $attrs['commonKeymap' + KeyName + 'Up'];

				var handlers = {
					repeat: attrRepeat && $parse(attrRepeat) || attrRepeat2 && $parse(attrRepeat2)
					, down: attrDown && $parse(attrDown)
					, up: attrUp && $parse(attrUp)
				};

				handlersCache[keyName] = handlers;
				return handlers;
			};
			return getHandlers;
		}
		,
		createMapper: function($attrs, $scope) {
			var mapper;
			var mapAttr = $attrs['commonKeymap'];
			if (!mapAttr) {
				// Pass-through:
				mapper = function(keyName) { return keyName; };
			} else {
				var mappedKeys;
				$scope.$watch(mapAttr, function(map) {
					// The map should look like:
					// map = { 'anyarrow': 'up down left right' }
					// But for faster lookups, we'll index this to:
					// mappedKeys = { up: 'anyarrow', down: 'anyarrow', left: 'anyarrow', right: 'anyarrow' }
					mappedKeys = {};
					for (var mapDest in map) {
						if (!map.hasOwnProperty(mapDest)) continue;
						var mapSources = map[mapDest];
						if (typeof mapSources === 'string') mapSources = mapSources.split(' ');

						for (var i = 0, l = mapSources.length; i < l; i++) {
							var mapSource = mapSources[i];
							mappedKeys[mapSource] = mapDest;
						}
					}
				});

				mapper = function (keyName) {
					return mappedKeys[keyName] || keyName;
				};
			}

			return mapper;
		}
	};

	return commonKeymap.link;
}]);
