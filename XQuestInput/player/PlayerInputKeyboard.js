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
		contextMenu: pauseGame,

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

	XQuestInput.PlayerInputKeyboard = Smart.Class({
		initialize: function(game, element) {
			this.game = game;

			if (!element) {
				element = document;
			}
			this.keyMapper = new XQuestInput.KeyMapper(element, this._onActionDown.bind(this));
			this.keyMapper.disableContextMenu();

			this.setKeyMap(keyMap);
		},
		setKeyMap: function(keyMap) {
			this.keyMapper.setKeyMap(keyMap);
		},
		_onActionDown: function(action) {
			switch (action) {
				case pauseGame:
					this.game.pauseGame();
					break;
			}
		},

		onInput: function(tickEvent, inputState) {
			var sensitivity = UserSettings.keyboardSensitivity;
			var downActions = this.keyMapper.getDownActions();

			var activeInputs = 4;

			if (downActions[primaryWeapon]) inputState.primaryWeapon = true;
			else activeInputs--;

			if (downActions[secondaryWeapon]) inputState.secondaryWeapon = true;
			else activeInputs--;

			if (downActions[accelerateLeft]) inputState.accelerationX += -sensitivity;
			else if (downActions[accelerateRight]) inputState.accelerationX += sensitivity;
			else activeInputs--;

			if (downActions[accelerateUp]) inputState.accelerationY += -sensitivity;
			else if (downActions[accelerateDown]) inputState.accelerationY += sensitivity;
			else activeInputs--;
			
			if (activeInputs >= 1)
				inputState.engaged = true;
		}

	});

	XQuestInput.KeyMapper = Smart.Class({
		element: null,
		onActionDown: null,
		codes: {
			8: 'backspace',
			9: 'tab',
			13: 'enter',
			16: 'shift',
			17: 'ctrl',
			18: 'alt',
			19: 'pause',
			20: 'capslock',
			27: 'escape',
			32: 'space',
			33: 'pageup',
			34: 'pagedown',
			35: 'end',
			36: 'home',
			37: 'left',
			38: 'up',
			39: 'right',
			40: 'down',
			45: 'insert',
			46: 'delete',
			93: 'contextMenu',
			96: 'numpad0',
			97: 'numpad1',
			98: 'numpad2',
			99: 'numpad3',
			100: 'numpad4',
			101: 'numpad5',
			102: 'numpad6',
			103: 'numpad7',
			104: 'numpad8',
			105: 'numpad9',
			112: 'f1',
			113: 'f2',
			114: 'f3',
			115: 'f4',
			116: 'f5',
			117: 'f6',
			118: 'f7',
			119: 'f8',
			120: 'f9',
			121: 'f10',
			122: 'f11',
			123: 'f12',
			144: 'numlock',
			145: 'scrolllock'
		},
		keyMap: null,
		downKeys: null,
		downActions: null,

		initialize: function(element, onActionDown) {
			this.element = element;
			this.onActionDown = onActionDown;
			this.codes = _.clone(this.codes);
			this.downKeys = [];
			this.downActions = {};

			this.element.addEventListener('keydown', this._onKeydown.bind(this));
			this.element.addEventListener('keyup', this._onKeyup.bind(this));
		},
		_onKeydown: function(ev) {
			var keyName = this._getKeyName(ev);
			var downIndex = this.downKeys.indexOf(keyName);
			var isDown = (downIndex !== -1);
			if (!isDown) {
				this.downKeys.push(keyName);
				var action = this.keyMap[keyName];
				if (action) {
					var downAction = (this.downActions[action] || 0) + 1;
					this.downActions[action] = downAction;
					if (downAction === 1) {
						this.onActionDown(action);
					}
				}
			}
		},
		_onKeyup: function(ev) {
			var keyName = this._getKeyName(ev);
			var downIndex = this.downKeys.indexOf(keyName);
			var wasDown = (downIndex !== -1);
			if (wasDown) {
				this.downKeys.splice(downIndex, 1);
				var action = this.keyMap[keyName];
				if (action) {
					var downAction = (this.downActions[action] || 1) - 1;
					this.downActions[action] = downAction;
				}
			}
		},
		_getKeyName: function(ev) {
			var keyName =
				this.codes[ev.keyCode]
				|| (ev.keyIdentifier && ev.keyIdentifier.indexOf('U+') === -1 && ev.keyIdentifier.toLowerCase())
				|| (ev.key && ev.key.indexOf('U+') === -1 && ev.key.toLowerCase())
				|| String.fromCharCode(ev.keyCode)
				|| 'unknown';
			return keyName;
		},

		getDownActions: function() {
			return this.downActions;
		},

		setKeyMap: function(keyMap) {
			this.keyMap = keyMap;
		},

		disableContextMenu: function(disabled) {
			if (disabled === undefined) disabled = true;

			if (disabled) {
				window.addEventListener('contextmenu', preventDefault);
			} else {
				window.removeEventListener('contextmenu', preventDefault);
			}
		}
	});

	function preventDefault(ev) {
		ev.preventDefault();
	}

})();
