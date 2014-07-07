(function init_PlayerInputXO() {
	/** Controller input for Xbox One */


	var UserSettings = {
		analogThreshold: 0.05,
		analogSensitivity: 20
	};

	var playerActions = {
		analogX: 'analogX'
		,analogY: 'analogY'
		,primaryWeapon: 'primaryWeapon'
		,secondaryWeapon: 'secondaryWeapon'
		,pauseGame: 'pauseGame'
	};
	var controllerMap = {
		isMenuPressed: playerActions.pauseGame,
		isViewPressed: playerActions.pauseGame,

		isAPressed: playerActions.primaryWeapon,
		isBPressed: playerActions.secondaryWeapon,
		isXPressed: playerActions.primaryWeapon,
		isYPressed: playerActions.secondaryWeapon,

		//isDPadDownPressed: playerActions.accelerateDown,
		//isDPadLeftPressed: playerActions.accelerateLeft,
		//isDPadRightPressed: playerActions.accelerateRight,
		//isDPadUpPressed: playerActions.accelerateUp,

		isLeftShoulderPressed: playerActions.secondaryWeapon,
		isRightShoulderPressed: playerActions.primaryWeapon,
		//leftTrigger: playerActions.secondaryWeapon,
		//rightTrigger: playerActions.primaryWeapon,

		leftThumbstickX: playerActions.analogX,
		leftThumbstickY: playerActions.analogY,
		isLeftThumbstickPressed: playerActions.primaryWeapon,

		//rightThumbstickX: playerActions.analogX,
		//rightThumbstickY: playerActions.analogY,
		isRightThumbstickPressed: playerActions.primaryWeapon
	};


	XQuestGame.PlayerInputXO = Smart.Class({
		controllerMapping: null
		,initialize: function(game) {
			this.game = game;

			this.controllerMapping = new ControllerMapper();
			this.controllerMapping.setControllerMapping(controllerMap);
		}

		,onInput: function(tickEvent, inputState) {
			var analogSensitivity = UserSettings.analogSensitivity
				,analogThreshold = UserSettings.analogThreshold;
			var controllerActions = this.controllerMapper.getControllerActions();

			if (controllerActions[playerActions.primaryWeapon]) inputState.primaryWeapon = true;
			if (controllerActions[playerActions.secondaryWeapon]) inputState.secondaryWeapon = true;

			if (Math.abs(controllerActions[playerActions.analogX]) > analogThreshold
					&& Math.abs(controllerActions[playerActions.analogY]) > analogThreshold) {
				inputState.accelerationX += controllerActions[playerActions.analogX] * analogSensitivity;
				inputState.accelerationY += controllerActions[playerActions.analogY] * analogSensitivity;
			}
		}

	}).extend({

		createIfAvailable: function() {
			var isXbox = (window.Windows && window.Windows.Xbox);
			if (!isXbox) return null;

			return new XQuestGame.PlayerInputXO();
		}

	});

	var ControllerMapper = Smart.Class({
		setController: function(xboxController) {
			this.xboxController = xboxController;
		}
		, setControllerMapping: function(controllerMapping) {
			this.controllerMapping = controllerMapping;
		}
		, getControllerActions: function() {
			var currentReading = this.xboxController.getCurrentReading();
			var controllerActions = {};

			for (var controllerButtonName in this.controllerMapping) {
				if (!this.controllerMapping.hasOwnProperty(controllerButtonName)) continue;

				var action = this.controllerMapping[controllerButtonName],
					value = currentReading[controllerButtonName];

				controllerActions[action] = value;
			}

			return controllerActions;
		}
	});
})();