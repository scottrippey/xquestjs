(function init_PlayerInputXO() {
	/* Gamepad input for Xbox One */


	var UserSettings = {
		analogThreshold: 0.05,
		analogSensitivity: 20,
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
		

	XQuestInput.PlayerInputGamepad = Smart.Class({
		initialize: function(game) {
			this.game = game;
			this.allGamepads = [];
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
					
					if (downKey = MenuActions.invoke) {
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
			if (actions[PlayerActions.primaryWeapon]) inputState.primaryWeapon = true;
			if (actions[PlayerActions.secondaryWeapon]) inputState.secondaryWeapon = true;
			var analogX = actions[PlayerActions.analogX],
				analogY = actions[PlayerActions.analogY];
			if (Math.abs(analogX) > analogThreshold
				&& Math.abs(analogY) > analogThreshold) {
				inputState.accelerationX += analogX * analogSensitivity;
				inputState.accelerationY += analogY * analogSensitivity;
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
		isBPressed: PlayerActions.secondaryWeapon,
		isXPressed: PlayerActions.primaryWeapon,
		isYPressed: PlayerActions.secondaryWeapon,

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
	XQuestGame.PlayerInputGamepad.XboxGamepadMapper = Smart.Class({
		initialize: function(xboxGamepad, playerMap, menuMap) {
			this.xboxGamepad = xboxGamepad;
			this.playerMap = playerMap;
			this.menuMap = menuMap;
			this.previousActions = {};
		}
		, getPlayerActions: function() {
			return this._mapXboxGamepadActions(this.playerMap);
		}
		, _mapXboxGamepadActions: function(actionsMap) {
			var currentReading = this.xboxGamepad.getCurrentReading();
			var gamepadActions = {};
			for (var gamepadButtonName in actionsMap) {
				if (!actionsMap.hasOwnProperty(gamepadButtonName)) continue;

				var action = actionsMap[gamepadButtonName],
					value = currentReading[gamepadButtonName];

				gamepadActions[action] = value;
			}

			return gamepadActions;
		}
		, getMenuActions: function() {
			var currentActions = this._mapXboxGamepadActions(this.menuMap);
			
			var previousActions = this.previousActions;
			this.previousActions = currentActions;
						
			var menuActions = [];
			for (var actionName in currentActions) {
				if (!currentActions.hasOwnProperty(actionName)) continue;
				var previousAction = previousActions[actionName];				
				var currentAction = currentActions[actionName];
				
				// Deal with analog inputs:
				if (actionName === MenuActionsAnalogX) {
					var wasDownX = this.isDownX;
					this.isDownX = this._analogToBoolean(Math.abs(currentAction), wasDownX);
					if (!wasDownX && this.isDownX) {
						menuActions.push(currentAction < 0 ? MenuActions.menuLeft : MenuActions.menuRight);
					}
				} else if (actionName === MenuActionsAnalogY) {
					var wasDownY = this.isDownY;
					this.isDownY = this._analogToBoolean(Math.abs(currentAction), wasDownY);
					if (!wasDownY && this.isDownY) {
						menuActions.push(currentAction < 0 ? MenuActions.menuUp : MenuActions.menuDown);
					}
				} else {
					if (currentAction && currentAction !== previousAction) {
						menuActions.push(currentAction);
					}
				}
			}
			return menuActions;
		}
		,_analogToBoolean: function(analogValue, wasAlreadyDown) {
			var threshold = (wasAlreadyDown ? UserSettings.analogUpThreshold : UserSettings.analogDownThreshold);
			return (analogValue >= threshold);
		}
	});
	
	
	function createGamepadInput() {
		var Windows = window.Windows, Xbox = (Windows && Windows.Xbox);
		if (!Xbox) return null;
		
		var gamepadInput = new XQuestGame.PlayerInputGamepad();
		
		function addXboxGamepad(xboxGamepad) {
			var gamepad = new XQuestGame.PlayerInputGamepad.XboxGamepadMapper(xboxGamepad, xboxPlayerMap, xboxMenuMap);
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
		Gamepad.addEventListener('gamepadadded', function(eventArgs) {
			addXboxGamepad(eventArgs.gamepad);
		});
		Gamepad.removeEventListener('gamepadremoved', function(eventArgs) {
			removeXboxGamepad(eventArgs.gamepad);
		});
		
		
	}
	
	
})();