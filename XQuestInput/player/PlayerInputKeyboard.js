(function() {

	var UserSettings = {
		keyboardSensitivity: 5
	};

	// Available actions:
	var playerActions = {
		accelerateUp: 'accelerateUp'
		,accelerateDown: 'accelerateDown'
		,accelerateLeft: 'accelerateLeft'
		,accelerateRight: 'accelerateRight'
		,primaryWeapon: 'primaryWeapon'
		,secondaryWeapon: 'secondaryWeapon'
		,pauseGame: 'pauseGame'
	};

	var debugActions = {
		gatherClosestCrystal: 'gatherClosestCrystal'
		, spawnEnemy: 'spawnEnemy'
		, killPlayer: 'killPlayer'
		, toggleFPS: 'toggleFPS'
		, toggleDebugStats: 'toggleDebugStats'
		, activateInvincible: 'activateInvincible'
		, activateRapidFire: 'activateRapidFire'
		, activateTripleShot: 'activateTripleShot'
		, activateAutoAim: 'activateAutoAim'
		, activateSprayShot: 'activateSprayShot'
		, activatePowerShot: 'activatePowerShot'
		, addBomb: 'addBomb'
		, spawnPowerCrystal: 'spawnPowerCrystal'
	};
	
	var keyMap = {
		escape: playerActions.pauseGame,
		contextMenu: playerActions.pauseGame,

		up: playerActions.accelerateUp,
		down: playerActions.accelerateDown,
		left: playerActions.accelerateLeft,
		right: playerActions.accelerateRight,
		space: playerActions.primaryWeapon,
		enter: playerActions.secondaryWeapon,

		numpad8: playerActions.accelerateUp,
		numpad2: playerActions.accelerateDown,
		numpad4: playerActions.accelerateLeft,
		numpad6: playerActions.accelerateRight,
		numpadadd: playerActions.primaryWeapon,
		numpadenter: playerActions.secondaryWeapon,


		c: debugActions.gatherClosestCrystal,
		s: debugActions.spawnEnemy,
		d: debugActions.killPlayer,
		
		p: debugActions.toggleFPS,
		//i: debugActions.toggleDebugStats,
		
		1: debugActions.activateInvincible,
		2: debugActions.activateRapidFire,
		3: debugActions.activateTripleShot,
		4: debugActions.activateAutoAim,
		5: debugActions.activateSprayShot,
		6: debugActions.activatePowerShot,
		9: debugActions.addBomb,
		0: debugActions.spawnPowerCrystal
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
				case playerActions.pauseGame:
					this.game.pauseGame();
					break;
				case debugActions.gatherClosestCrystal:
					this.game.debug().gatherClosestCrystal();
					break;
				case debugActions.spawnEnemy:
					this.game.debug().spawnEnemy();
					break;
				case debugActions.spawnPowerCrystal:
					this.game.debug().spawnPowerCrystal();
					break;
				case debugActions.killPlayer:
					this.game.debug().killPlayer();
					break;
				case debugActions.toggleFPS:
					this.game.debug().toggleFPS();
					break;
				case debugActions.toggleDebugStats:
					this.game.debug().toggleDebugStats();
					break;
				case debugActions.activateInvincible:
					this.game.debug().activatePowerup('invincible');
					break;
				case debugActions.activateRapidFire:
					this.game.debug().activatePowerup('rapidFire');
					break;
				case debugActions.activateTripleShot:
					this.game.debug().activatePowerup('tripleShot');
					break;
				case debugActions.activateAutoAim:
					this.game.debug().activatePowerup('autoAim');
					break;
				case debugActions.activateSprayShot:
					this.game.debug().activatePowerup('sprayShot');
					break;
				case debugActions.activatePowerShot:
					this.game.debug().activatePowerup('powerShot');
					break;
				case debugActions.addBomb:
					this.game.debug().addBomb();
					break;
			}
		},

		onInput: function(tickEvent, inputState) {
			var sensitivity = UserSettings.keyboardSensitivity;
			var downActions = this.keyMapper.getDownActions();

			var activeInputs = 4;

			if (downActions[playerActions.primaryWeapon]) inputState.primaryWeapon = true;
			else activeInputs--;

			if (downActions[playerActions.secondaryWeapon]) inputState.secondaryWeapon = true;
			else activeInputs--;

			if (downActions[playerActions.accelerateLeft]) inputState.accelerationX += -sensitivity;
			else if (downActions[playerActions.accelerateRight]) inputState.accelerationX += sensitivity;
			else activeInputs--;

			if (downActions[playerActions.accelerateUp]) inputState.accelerationY += -sensitivity;
			else if (downActions[playerActions.accelerateDown]) inputState.accelerationY += sensitivity;
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
			var action = this.keyMap[keyName];
			if (!action) return;

			ev.preventDefault();

			var downIndex = this.downKeys.indexOf(keyName);
			var isAlreadyDown = (downIndex !== -1);
			if (isAlreadyDown) return;
			this.downKeys.push(keyName);
			
			var downActionCount = (this.downActions[action] || 0) + 1;
			this.downActions[action] = downActionCount;
			if (downActionCount === 1) {
				this.onActionDown(action);
			}
		},
		_onKeyup: function(ev) {
			var keyName = this._getKeyName(ev);
			var action = this.keyMap[keyName];
			if (!action) return;
			
			var downIndex = this.downKeys.indexOf(keyName);
			var wasDown = (downIndex !== -1);
			if (!wasDown) return;
			this.downKeys.splice(downIndex, 1);
			
			ev.preventDefault();
			
			var downActionCount = (this.downActions[action] || 1) - 1;
			this.downActions[action] = downActionCount;
		},
		_getKeyName: function(ev) {
			var modifiers = "";
			if (ev.ctrlKey) modifiers += "ctrl+";
			if (ev.altKey) modifiers += "alt+";
			if (ev.shiftKey) modifiers += "shift+";
			var key =
				this.codes[ev.keyCode]
				|| (ev.keyIdentifier && ev.keyIdentifier.indexOf('U+') === -1 && ev.keyIdentifier.toLowerCase())
				|| (ev.key && ev.key.indexOf('U+') === -1 && ev.key.toLowerCase())
				|| String.fromCharCode(ev.keyCode).toLowerCase()
				|| 'unknown';
			
			return modifiers + key;
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
