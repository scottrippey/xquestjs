XQuestGame.XQuestHost.Settings = Smart.Class({
	initialize: function() {
		this._watches = {};
	},
	watchSetting: function(settingName, defaultValue, watchHandler) {
		var currentValue = this.retrieveSetting(settingName) || this.saveSetting(settingName, defaultValue);
		
		if (!this._watches[settingName]) {
			this._watches[settingName] = [ watchHandler ];
		} else {
			this._watches[settingName].push(watchHandler);
		}

		watchHandler(currentValue);
	},
	saveSetting: function(settingName, settingValue) {
		if (settingValue == null) {
			localStorage.removeItem(settingName);
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
	,
	retrieveSetting: function(settingName) {
		return localStorage.getItem(settingName) || null;
	}
});