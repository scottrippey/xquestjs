/*
 ng-mousemove="ui.onMouseMove($event)"
 ng-mousedown="ui.primaryWeapon(true); $event.preventDefault();"
 ng-mouseup="ui.primaryWeapon(false);"
 ng-mouseleave="ui.togglePause(true)"

 */

(function() {
	var primaryWeapon = 'primaryWeapon', secondaryWeapon = 'secondaryWeapon';
	var mouseMap = {
		left: primaryWeapon
		, right: secondaryWeapon
	};
	var UserSettings = {
		mouseSensitivity: 2,
		mouseBiasSensitivity: 2
	};

	XQuestInput.MouseInput = Smart.Class({
		element: null,
		elementSize: null,
		mouseState: null,

		initialize: function(game, element) {
			this.game = game;
			this.game.input.addGameInput(this);
			this.element = element;
			this.mouseState = {};
			this.mouseMap = mouseMap;

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
		},

		_onWindowResize: function() {
			this.elementSize = null;
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
			if (this.elementSize === null) {
				this.elementSize = getElementSize(this.element);
			}

			var mousePosition = getMousePosition(ev);
			var delta = this._updateMousePosition(mousePosition);
			if (!delta)
				return;

			var acceleration = this._adjustForSensitivity(delta, mousePosition, this.elementSize);

			this.mouseState.accelerationX += acceleration.x;
			this.mouseState.accelerationY += acceleration.y;
		},
		_updateMousePosition: function(mousePosition) {
			var delta = null;
			if (this.previousMousePosition) {
				delta = {
					x: mousePosition.x - this.previousMousePosition.x
					, y: mousePosition.y - this.previousMousePosition.y
				};
			}
			this.previousMousePosition = mousePosition;

			return delta;
		},
		_adjustForSensitivity: function(delta, mousePosition, elementSize) {
			var sensitivity = UserSettings.mouseSensitivity
				, biasSensitivity = UserSettings.mouseBiasSensitivity;

			var distanceFromCenter = {
				x: 2 * ((mousePosition.x / elementSize.width) - 0.5)
				, y: 2 * ((mousePosition.y / elementSize.height) - 0.5)
			};

			var bias = {
				x: this._getBias(distanceFromCenter.x, delta.x, biasSensitivity)
				, y: this._getBias(distanceFromCenter.y, delta.y, biasSensitivity)
			};
			var acceleration = {
				x: delta.x * sensitivity * bias.x
				, y: delta.y * sensitivity * bias.y
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

		mergeInputState: function(state) {

			var mouseState = this.mouseState;

			if (mouseState.primaryWeapon) state.primaryWeapon = true;
			if (mouseState.secondaryWeapon) state.secondaryWeapon = true;
			if (mouseState.accelerationX) state.accelerationX += mouseState.accelerationX;
			if (mouseState.accelerationY) state.accelerationY += mouseState.accelerationY;
			if (mouseState.engaged) state.engaged = true;

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
			case 2: return 'right';
			case 3: return 'middle';
			case 4: return 'xbutton1';
			case 5: return 'xbutton2';
			default: return 'none';
		}
	}

})();
