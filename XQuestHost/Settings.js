XQuestGame.XQuestHost.Settings = Smart.Class({
	defaultSettings: {
		mouseSettings: {
			mouseSensitivity: 8,
			maxMouseSensitivity: 10,
			sensitivityMultiplier: 100,
			
			mouseBiasSensitivity: 5,
			biasMultiplier: 0.2,
			maxMouseBias: 10,
			
			maxMouseMove: 40 // Maximum mouse delta per mousemove event
		}
		, keyboardSettings: {
			keyboardSensitivity: 5
		}
		, touchSettings: {
			touchSensitivity: 2,
			inactiveTouchTimeout: 4
		}
		, gameSettings: {
			difficulty: 5
		}
	},
	initialize: function() {
		this._watches = {};
	},
	watchSetting: function(settingName, watchHandler) {
		var currentValue = this.retrieveSetting(settingName);
		
		if (!this._watches[settingName]) {
			this._watches[settingName] = [ watchHandler ];
		} else {
			this._watches[settingName].push(watchHandler);
		}

		watchHandler(currentValue);
	},
	
	retrieveSetting: function(settingName) {
		var settingValue = localStorage.getItem(settingName);
		if (settingValue) {
			try {
				settingValue = JSON.parse(settingValue);
			} catch (ex) {
				settingValue = null;
			}
		}
		if (!settingValue) {
			settingValue = _.clone(this.defaultSettings[settingName]) || null;
		}
		
		return settingValue;
	},
	saveSetting: function(settingName, settingValue) {
		if (settingValue == null) {
			localStorage.removeItem(settingName);
			settingValue = this.retrieveSetting(settingName);
		} else {
			localStorage.setItem(settingName, JSON.stringify(settingValue));
		}
		
		if (this._watches[settingName]) {
			this._watches[settingName].forEach(function(watchHandler) {
				watchHandler(settingValue);
			});
		}
		
		return settingValue;
	}
});