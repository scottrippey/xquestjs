import { Class } from "../../common/src/Smart/Smart.Class.js";

XQuestGame.XQuestHost.Settings = Class({
  defaultSettings: {
    mouseSettings: {
      mouseSensitivity: 5,
      maxMouseSensitivity: 10,
      sensitivityMultiplier: 100,

      mouseBiasSensitivity: 5,
      biasMultiplier: 0.7,
      maxMouseBias: 10,

      maxMouseMove: 40, // Maximum mouse delta per mousemove event
    },
    keyboardSettings: {
      keyboardSensitivity: 5,
      maxKeyboardSensitivity: 10,
    },
    touchSettings: {
      touchSensitivity: 5,
      maxTouchSensitivity: 10,
      touchSensitivityMultiplier: 0.5,
      inactiveTouchTimeout: 4,
    },
    gameSettings: {
      difficulty: 5,
    },
  },
  initialize: function Settings() {
    this._watches = {};
  },
  watchSetting(settingName, watchHandler) {
    var currentValue = this.retrieveSetting(settingName);

    if (!this._watches[settingName]) {
      this._watches[settingName] = [watchHandler];
    } else {
      this._watches[settingName].push(watchHandler);
    }

    watchHandler(currentValue);
  },

  retrieveSetting(settingName) {
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
  saveSetting(settingName, settingValue) {
    if (settingValue == null) {
      localStorage.removeItem(settingName);
      settingValue = this.retrieveSetting(settingName);
    } else {
      localStorage.setItem(settingName, JSON.stringify(settingValue));
    }

    if (this._watches[settingName]) {
      this._watches[settingName].forEach((watchHandler) => {
        watchHandler(settingValue);
      });
    }

    return settingValue;
  },
});
