(function init_PlayerInputXO() {
	/* Gamepad input for Xbox One */


	var UserSettings = {
		analogThreshold: 0.05,
		analogSensitivity: 8,
		analogDownThreshold: 0.6,
		analogUpThreshold: 0.4
	};
	var MenuActions = XQuestGame.MenuSceneInputs;
	var MenuActionsAnalogX = 'MenuActionsAnalogX', MenuActionsAnalogY = 'MenuActionsAnalogY';
	var PlayerActions = {
		pauseGame: 'pauseGame'
		, analogX: 'analogX'
		, analogY: 'analogY'
		, primaryWeapon: 'primaryWeapon'
		, secondaryWeapon: 'secondaryWeapon'
	};
		

	XQuestInput.PlayerInputGamepad = Smart.Class(new Smart.Disposable(), {
		initialize: function(game) {
			this.game = game;
			this.allGamepads = [];

			this._disableAllKeystrokes();
		}
		,addGamepad: function(gamepadId, gamepad) {
			gamepad.gamepadId = gamepadId;
			this.allGamepads.push(gamepad);
		}
		,removeGamepad: function(gamepadId) {
			for (var i = 0; i < this.allGamepads.length; i++) {
				if (this.allGamepads[i].gamepadId === gamepadId) {
					this.allGamepads.splice(i, 1);
					return;
				}
			}
		}
		,onInput: function(tickEvent, inputState) {
			if (inputState.menuMode) {
				this._onInput_menu(tickEvent, inputState);
			} else {
				this._onInput_player(tickEvent, inputState);
			}
		}
		,_onInput_menu: function(tickEvent, inputState) {
			var allGamepads = this.allGamepads;
			
			for (var i = 0; i < allGamepads.length; i++) {
				var gamepad = allGamepads[i];
				
				var downQueue = gamepad.getMenuActions();
				for (var j = 0; j < downQueue.length; j++) {
					var downKey = downQueue[j];
					inputState[downKey] = true;
					
					if (downKey = MenuActions.menuInvoke) {
						this.currentGamepad = gamepad;
					}
				}
			}
		}
		,_onInput_player: function(tickEvent, inputState) {
			var analogSensitivity = UserSettings.analogSensitivity
				,analogThreshold = UserSettings.analogThreshold;
			var currentGamepad = this.currentGamepad;
			
			if (!currentGamepad) return;

			var actions = currentGamepad.getPlayerActions();
			if (actions[PlayerActions.primaryWeapon])
				inputState.primaryWeapon = true;
			if (actions[PlayerActions.secondaryWeapon])
				inputState.secondaryWeapon = true;
			if (actions[PlayerActions.pauseGame]) {
				if (!this.isPauseDown) {
					this.isPauseDown = true;
					this.game.pauseGame();
				}
			} else {
				this.isPauseDown = false;
			}
				
			var analogX = actions[PlayerActions.analogX],
				analogY = -actions[PlayerActions.analogY];
			if (Math.abs(analogX) > analogThreshold
				|| Math.abs(analogY) > analogThreshold) {
				inputState.accelerationX += analogX * analogSensitivity;
				inputState.accelerationY += analogY * analogSensitivity;
			}
		}
		,_disableAllKeystrokes: function() {
			var useCapture = true;
			document.addEventListener('keydown', stopEvent, useCapture);
			document.addEventListener('keyup', stopEvent, useCapture);
			document.addEventListener('keypress', stopEvent, useCapture);
			this.onDispose(function() {
				document.removeEventListener('keydown', stopEvent, useCapture);
				document.removeEventListener('keyup', stopEvent, useCapture);
				document.removeEventListener('keypress', stopEvent, useCapture);
			});

			function stopEvent(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			}


		}
	}).extend({
		/**
		 * (returns null if not supported)
		 */
		createGamepadInput: createGamepadInput
	});
	



	var xboxPlayerMap = {
		isMenuPressed: PlayerActions.pauseGame,
		isViewPressed: PlayerActions.pauseGame,

		isAPressed: PlayerActions.primaryWeapon,
		isBPressed: PlayerActions.pauseGame,
		isXPressed: PlayerActions.secondaryWeapon,
		isYPressed: PlayerActions.pauseGame,

		//isDPadDownPressed: PlayerActions.accelerateDown,
		//isDPadLeftPressed: PlayerActions.accelerateLeft,
		//isDPadRightPressed: PlayerActions.accelerateRight,
		//isDPadUpPressed: PlayerActions.accelerateUp,

		isLeftShoulderPressed: PlayerActions.secondaryWeapon,
		isRightShoulderPressed: PlayerActions.primaryWeapon,
		//leftTrigger: PlayerActions.secondaryWeapon,
		//rightTrigger: PlayerActions.primaryWeapon,

		leftThumbstickX: PlayerActions.analogX,
		leftThumbstickY: PlayerActions.analogY,
		isLeftThumbstickPressed: PlayerActions.primaryWeapon,

		//rightThumbstickX: PlayerActions.analogX,
		//rightThumbstickY: PlayerActions.analogY,
		isRightThumbstickPressed: PlayerActions.primaryWeapon
	};
	var xboxMenuMap = {
		isMenuPressed: MenuActions.menuInvoke,
		isViewPressed: MenuActions.menuInvoke,

		isAPressed: MenuActions.menuInvoke,
		isBPressed: MenuActions.menuBack,
		//isXPressed: ,
		//isYPressed: ,

		isDPadDownPressed: MenuActions.menuDown,
		isDPadLeftPressed: MenuActions.menuLeft,
		isDPadRightPressed: MenuActions.menuRight,
		isDPadUpPressed: MenuActions.menuUp,

		//isLeftShoulderPressed: ,
		//isRightShoulderPressed: ,
		//leftTrigger: ,
		//rightTrigger: ,

		leftThumbstickX: MenuActionsAnalogX,
		leftThumbstickY: MenuActionsAnalogY
		//isLeftThumbstickPressed: ,

		//rightThumbstickX: ,
		//rightThumbstickY: ,
		//isRightThumbstickPressed: 
	};
	XQuestInput.PlayerInputGamepad.XboxGamepadMapper = Smart.Class({
		initialize: function(xboxGamepad, playerMap, menuMap) {
			this.xboxGamepad = xboxGamepad;
			this.playerMap = playerMap;
			this.menuMap = menuMap;
			this.previousActions = {};
		}
		, getPlayerActions: function() {
			return this._mapXboxGamepadActions(this.playerMap);
		}
		, getMenuActions: function() {
			var currentActionValues = this._mapXboxGamepadActions(this.menuMap);
			
			var previousActionValues = this.previousActions;
			this.previousActions = currentActionValues;
						
			var menuActions = [];
			for (var actionName in currentActionValues) {
				if (!currentActionValues.hasOwnProperty(actionName)) continue;
				var previousValue = previousActionValues[actionName];
				var currentValue = currentActionValues[actionName];
				
				// Deal with analog inputs:
				if (actionName === MenuActionsAnalogX) {
					var wasDownX = this.isDownX;
					this.isDownX = this._analogToBoolean(Math.abs(currentValue), wasDownX);
					if (!wasDownX && this.isDownX) {
						menuActions.push(currentValue < 0 ? MenuActions.menuLeft : MenuActions.menuRight);
					}
				} else if (actionName === MenuActionsAnalogY) {
					currentValue = -currentValue;
					var wasDownY = this.isDownY;
					this.isDownY = this._analogToBoolean(Math.abs(currentValue), wasDownY);
					if (!wasDownY && this.isDownY) {
						menuActions.push(currentValue < 0 ? MenuActions.menuUp : MenuActions.menuDown);
					}
				} else {
					if (currentValue && currentValue !== previousValue) {
						menuActions.push(actionName);
					}
				}
			}
			return menuActions;
		}
		, _mapXboxGamepadActions: function(actionsMap) {
			var currentReading = this.xboxGamepad.getCurrentReading();
			var gamepadActions = {};
			for (var gamepadButtonName in actionsMap) {
				if (!actionsMap.hasOwnProperty(gamepadButtonName)) continue;

				var actionName = actionsMap[gamepadButtonName],
					readingValue = currentReading[gamepadButtonName];

				if (readingValue !== false) {
					gamepadActions[actionName] = readingValue;
				}
			}

			return gamepadActions;
		}
		, _analogToBoolean: function(analogValue, wasAlreadyDown) {
			var threshold = (wasAlreadyDown ? UserSettings.analogUpThreshold : UserSettings.analogDownThreshold);
			return (analogValue >= threshold);
		}
	});
	
	
	function createGamepadInput() {
		var Windows = window.Windows, Xbox = (Windows && Windows.Xbox);
		if (!Xbox) return null;
		
		var gamepadInput = new XQuestInput.PlayerInputGamepad();
		
		function addXboxGamepad(xboxGamepad) {
			var gamepad = new XQuestInput.PlayerInputGamepad.XboxGamepadMapper(xboxGamepad, xboxPlayerMap, xboxMenuMap);
			gamepadInput.addGamepad(xboxGamepad.id, gamepad);
		}
		function removeXboxGamepad(xboxGamepad) {
			gamepadInput.removeGamepad(xboxGamepad.id);
		}
		
		// Add existing gamepads:
		var Input = Xbox.Input, Gamepad = Input.Gamepad, gamepads = Gamepad.gamepads;
		for (var i = 0; i < gamepads.size; i++) {
			addXboxGamepad(gamepads[i]);
		}

		function onGamepadAdded(eventArgs) {
			addXboxGamepad(eventArgs.gamepad);
		}
		function onGamepadRemoved(eventArgs) {
			removeXboxGamepad(eventArgs.gamepad);
		}
		Gamepad.addEventListener('gamepadadded', onGamepadAdded);
		Gamepad.addEventListener('gamepadremoved', onGamepadRemoved);
		gamepadInput.onDispose(function() {
			Gamepad.removeEventListener('gamepadadded', onGamepadAdded);
			Gamepad.removeEventListener('gamepadremoved', onGamepadRemoved);
		});
		

		return gamepadInput;
	}
	
	
})();