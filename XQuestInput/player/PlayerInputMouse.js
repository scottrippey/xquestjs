(function _init_PlayerInputMouse() {
	var defaultMouseSettings = {
		mouseSensitivity: 10,
		sensitivityScale: 100,
		mouseBiasSensitivity: 2,
		maxMouseMove: 40 // Maximum mouse delta per mousemove event
	};

	var primaryWeapon = 'primaryWeapon', secondaryWeapon = 'secondaryWeapon';
	var mouseMap = {
		left: primaryWeapon
		, right: secondaryWeapon
	};

	XQuestInput.PlayerInputMouse = Smart.Class({ 
		element: null,
		elementSize: null,
		mouseState: null,
		previousMousePosition: null,

		initialize: function(game, element, settings) {
			this.game = game;
			this.element = element;
			this.mouseMap = mouseMap;
			
			settings.watchSetting('mouseSettings', defaultMouseSettings, function(mouseSettings) {
				this.mouseSettings = mouseSettings;
			}.bind(this));

			addEventListeners(this.element, {
				'mouseover': this._onMouseOver.bind(this),
				'mouseout': this._onMouseOut.bind(this),
				'mousedown': this._onMouseDown.bind(this),
				'mouseup': this._onMouseUp.bind(this),
				'mousemove': this._onMouseMove.bind(this)
			});

			addEventListeners(window, {
				'resize': this._onWindowResize.bind(this)
			});
			this._onWindowResize();
			
			this.game.onGamePaused(this._onGamePaused.bind(this));
			this._onGamePaused(false);
			
			this._resetMouseState();
		},
		_resetMouseState: function() {
			this.mouseState = { engaged: true, accelerationX: 0, accelerationY: 0 };
		},

		_onWindowResize: function() {
			this.elementSize = getElementSize(this.element);
			this.previousMousePosition = null;
		},

		_onGamePaused: function(paused) {
			this.element.style.cursor = paused ? null : "none";
			this.previousMousePosition = null;
			this._resetMouseState();
		},

		_onMouseOver: function(ev) {
			var isInsideElement = elementContains(this.element, ev.target);
			if (isInsideElement) {
				this.mouseState.engaged = true;
			}
		},
		_onMouseOut: function(ev) {
			var isInsideElement = elementContains(this.element, ev.relatedTarget);
			if (!isInsideElement) {
				this.mouseState.engaged = false;
				this.game.pauseGame(true);				
			}
		},
		_onMouseDown: function(ev) {
			var button = getMouseButton(ev);
			var action = this.mouseMap[button];
			if (action) {
				this.mouseState[action] = true;
				ev.preventDefault();
			}
		},
		_onMouseUp: function(ev) {
			var button = getMouseButton(ev);
			var action = this.mouseMap[button];
			if (action) {
				this.mouseState[action] = false;
			}
		},
		
		_onMouseMove: function(ev) {
			var mousePosition = getMousePosition(ev)
				, previousMousePosition = this.previousMousePosition
				, mouseSettings = this.mouseSettings;
			this.previousMousePosition = mousePosition;
			if (!previousMousePosition)
				return;
			

			var delta = {
				x: Math.min(mousePosition.x - previousMousePosition.x, mouseSettings.maxMouseMove)
				, y: Math.min(mousePosition.y - previousMousePosition.y, mouseSettings.maxMouseMove)
			};

			var acceleration = this._adjustForSensitivity(delta, mousePosition);

			this.mouseState.accelerationX += acceleration.x;
			this.mouseState.accelerationY += acceleration.y;
		},
		_adjustForSensitivity: function(delta, mousePosition) {
			var elementSize = this.elementSize
				, mouseSettings = this.mouseSettings
				, sensitivity = mouseSettings.mouseSensitivity * mouseSettings.sensitivityScale
				, biasSensitivity = mouseSettings.mouseBiasSensitivity;

			var screenDeltaX = delta.x / elementSize.width,
				screenDeltaY = delta.y / elementSize.height;

			var distanceFromCenterX = 2 * (mousePosition.x / elementSize.width) - 1,
				distanceFromCenterY = 2 * (mousePosition.y / elementSize.height) - 1;

			var biasX = this._getBias(distanceFromCenterX, delta.x, biasSensitivity),
				biasY = this._getBias(distanceFromCenterY, delta.y, biasSensitivity);

			var acceleration = {
				x: screenDeltaX * sensitivity * biasX
				, y: screenDeltaY * sensitivity * biasY
			};

			return acceleration;
		},
		_getBias: function(distanceFromCenter, deltaDirection, sensitivity) {
			// "Bias" is used to increase outward sensitivity, and decrease inward sensitivity.
			// This causes the user's mouse to gravitate toward the center of the page,
			// decreasing the likelihood of reaching the edges of the page.

			var isMovingAwayFromCenter = (distanceFromCenter < 0 && deltaDirection < 0) || (distanceFromCenter > 0 && deltaDirection > 0);
			distanceFromCenter = Math.abs(distanceFromCenter);
			if (isMovingAwayFromCenter) {
				return 1 + distanceFromCenter * (sensitivity - 1);
			} else {
				return 1 - distanceFromCenter + (distanceFromCenter / sensitivity);
			}
		},
		
		onInput: function(tickEvent, inputState) {
		
			var mouseState = this.mouseState;

			if (mouseState.primaryWeapon) inputState.primaryWeapon = true;
			if (mouseState.secondaryWeapon) inputState.secondaryWeapon = true;
			if (mouseState.accelerationX) inputState.accelerationX += mouseState.accelerationX;
			if (mouseState.accelerationY) inputState.accelerationY += mouseState.accelerationY;
			if (mouseState.engaged) inputState.engaged = true;

			mouseState.accelerationX = 0;
			mouseState.accelerationY = 0;
		}

	});

	function addEventListeners(element, events) {
		for (var eventName in events) {
			if (!events.hasOwnProperty(eventName)) continue;
			element.addEventListener(eventName, events[eventName]);
		}
	}
	function elementContains(element, child) {
		while (child) {
			if (child === element) return true;
			child = child.parentNode;
		}
		return false;
	}
	function getElementSize(element) {
		return { width: element.clientWidth, height: element.clientHeight };
	}
	function getMousePosition(ev) {
		return { x: ev.clientX, y: ev.clientY };
	}
	function getMouseButton(ev) {
		switch (ev.which || ev.button) {
			case 1: return 'left';
			case 2: return 'middle';
			case 3: return 'right';
			case 4: return 'xbutton1';
			case 5: return 'xbutton2';
			default: return 'none';
		}
	}

})();
