angular.module('XQuestHost').factory('UserSettings', [
	function() {
		var UserSettings = {
			mouseSensitivity: 2
			, mouseBiasSensitivity: 2
		};

		return UserSettings;
	}
]);