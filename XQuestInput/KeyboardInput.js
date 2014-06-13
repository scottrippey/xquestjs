/*

 common-keymap-c="ui.currentGame.debug().gatherClosestCrystal()"
 common-keymap-s="ui.currentGame.debug().spawnEnemy()"
 common-keymap-d="ui.currentGame.debug().killPlayer()"

 common-keymap-1="ui.currentGame.debug().activatePowerup('invincible')"
 common-keymap-2="ui.currentGame.debug().activatePowerup('rapidFire')"
 common-keymap-3="ui.currentGame.debug().activatePowerup('tripleShot')"
 common-keymap-4="ui.currentGame.debug().activatePowerup('autoAim')"
 common-keymap-5="ui.currentGame.debug().activatePowerup('powerShot')"
 common-keymap-6="ui.currentGame.debug().addBomb()"

 common-keymap-0="ui.currentGame.debug().spawnPowerCrystal()"

 */

(function() {

	var UserSettings = {
		keyboardSensitivity: 5
	};

	// Available actions:
	var accelerateUp = 'accelerateUp';
	var accelerateDown = 'accelerateDown';
	var accelerateLeft = 'accelerateLeft';
	var accelerateRight = 'accelerateRight';
	var primaryWeapon = 'primaryWeapon';
	var secondaryWeapon = 'secondaryWeapon';
	var pauseGame = 'pauseGame';

	var keyMap = {
		escape: pauseGame,

		up: accelerateUp,
		down: accelerateDown,
		left: accelerateLeft,
		right: accelerateRight,
		space: primaryWeapon,
		enter: secondaryWeapon,


		w: accelerateUp,
		s: accelerateDown,
		a: accelerateLeft,
		d: accelerateRight,

		8: accelerateUp,
		2: accelerateDown,
		4: accelerateLeft,
		6: accelerateRight,
		numpadadd: primaryWeapon,
		numpadenter: secondaryWeapon
	};

	XQuestInput.KeyboardInput = Smart.Class({
		initialize: function(game, element) {
			this.game = game;
			this.game.input.addGameInput(this);

			if (!element) {
				element = document;
			}
			this.keyHelper = new XQuestInput.KeyboardInput.KeyHelper(element, this._onOtherActionsDown.bind(this));

			this.setKeyMap(keyMap);
		},
		setKeyMap: function(keyMap) {
			this.keyHelper.setKeyMap(keyMap);
		},
		_onOtherActionsDown: function(downAction) {
			switch (downAction) {
				case pauseGame:
					this.game.pauseGame();
					break;
			}
		},

		mergeInputState: function(state) {
			var sensitivity = UserSettings.keyboardSensitivity;
			var downActions = this.keyHelper.getDownActions();

			if (downActions[primaryWeapon]) state.primaryWeapon = true;
			if (downActions[secondaryWeapon]) state.secondaryWeapon = true;

			var engaged = 2;
			if (downActions[accelerateUp]) state.accelerationY -= sensitivity;
			else if (downActions[accelerateDown]) state.accelerationY += sensitivity;
			else engaged -= 1;

			if (downActions[accelerateLeft]) state.accelerationX -= sensitivity;
			else if (downActions[accelerateRight]) state.accelerationX += sensitivity;
			else engaged -= 1;

			if (engaged) state.engaged = true;
		}

	});

	XQuestInput.KeyboardInput.KeyHelper = Smart.Class({
		element: null,
		codes: {
			13: 'enter',
			27: 'escape',
			32: 'space'
		},
		keyMap: null,
		downKeys: null,
		downActions: null,

		initialize: function(element) {
			this.element = element;
			this.codes = _.clone(this.codes);
			this.downKeys = [];
			this.downActions = {};

			this.element.addEventListener('keydown', this._onKeydown.bind(this));
			this.element.addEventListener('keyup', this._onKeyup.bind(this));
		},
		_onKeydown: function(event) {
			var keyName = this._getKeyName(event);
			var downIndex = this.downKeys.indexOf(keyName);
			var isDown = (downIndex !== -1);
			if (!isDown) {
				this.downKeys.push(keyName);
				var action = this.keyMap[keyName];
				if (action) {
					this.downActions[action] = (this.downActions[action] || 0) + 1;
				}
			}
		},
		_onKeyup: function(event) {
			var keyName = this._getKeyName(event);
			var downIndex = this.downKeys.indexOf(keyName);
			var wasDown = (downIndex !== -1);
			if (wasDown) {
				this.downKeys.splice(downIndex, 1);
				var action = this.keyMap[keyName];
				if (action) {
					this.downActions[action] = (this.downActions[action] || 1) - 1;
				}
			}
		},
		_getKeyName: function(event) {
			var keyName =
				this.codes[event.keyCode]
				|| (event.keyIdentifier && event.keyIdentifier.indexOf('U+') === -1 && event.keyIdentifier.toLowerCase())
				|| String.fromCharCode(event.keyCode)
				|| 'unknown';
			return keyName;
		},

		getDownActions: function() {
			return this.downActions;
		},

		setKeyMap: function(keyMap) {
			this.keyMap = keyMap;
		}
	})

})();
