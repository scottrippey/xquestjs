/*
 ng-mousemove="ui.onMouseMove($event)"
 ng-mousedown="ui.primaryWeapon(true); $event.preventDefault();"
 ng-mouseup="ui.primaryWeapon(false);"
 ng-mouseleave="ui.togglePause(true)"

 */

(function() {
	var UserSettings = {
		touchSensitivity: 2,
		touchBiasSensitivity: 2
	};

	XQuestInput.TouchInput = Smart.Class({
		element: null,
		elementSize: null,
		touches: null,
		touchState: null,

		initialize: function(game, element) {
			this.game = game;
			this.game.input.addGameInput(this);
			this.element = element;
			this.touchState = {};

			addEventListeners(this.element, {
				'touchstart': this._onTouchStart.bind(this),
				'touchend': this._onTouchEnd.bind(this),
				'touchleave': this._onTouchEnd.bind(this),
				'touchcancel': this._onTouchEnd.bind(this),
				'touchmove': this._onTouchMove.bind(this)
			});

			addEventListeners(window, {
				'resize': this._onWindowResize.bind(this)
			});
			this._onWindowResize();

		},

		_onWindowResize: function() {
			this.elementSize = getElementSize(this.element);
		},
		

		_onTouchStart: function(ev) {
			var touches = ev.changedTouches;
			for (var i = 0, l = touches.length; i < l; i++) {
				var touch = touches[i];
				if (!this.touchState.engaged) {
					this.touchState.engaged = touch.identifier;
					var touchPosition = getTouchPosition(ev);
					this._updateMousePosition(touchPosition);
				} else if (!this.touchState.primaryWeapon) {
					this.touchState.primaryWeapon = touch.identifier;
				} else if (!this.touchState.secondaryWeapon) {
					this.touchState.secondaryWeapon = touch.identifier;
				}
			}
		},
		_onTouchEnd: function(ev) {
			var touches = ev.changedTouches;
			for (var i = 0, l = touches.length; i < l; i++) {
				var touch = touches[i];
				if (this.touchState.engaged === touch.identifier) {
					this.touchState.engaged = false;
				} else if  (this.touchState.primaryWeapon === touch.identifier) {
					this.touchState.primaryWeapon = false;
				} else if (this.touchState.secondaryWeapon === touch.identifier) {
					this.touchState.secondaryWeapon = false;
				}
			}
		},
		_onTouchMove: function(ev) {
			var touches = ev.changedTouches;
			for (var i = 0, l = touches.length; i < l; i++) {
				var touch = touches[i];
				if (this.touchState.engaged === touch.identifier) {
					var touchPosition = getTouchPosition(ev);
					var delta = this._updateTouchPosition(touchPosition);
					if (!delta) continue;
					var acceleration = this._adjustForSensitivity(delta, touchPosition, this.elementSize);
					
					this.touchState.accelerationX += acceleration.x;
					this.touchState.accelerationY += acceleration.y;
				}
			}
		},
		
		_updateTouchPosition: function(touchPosition) {
			var delta = null;
			if (this.previousTouchPosition) {
				delta = {
					x: touchPosition.x - this.previousTouchPosition.x
					, y: touchPosition.y - this.previousTouchPosition.y
				};
			}
			this.previousTouchPosition = touchPosition;

			return delta;
		},
		_adjustForSensitivity: function(delta, touchPosition, elementSize) {
			var sensitivity = UserSettings.touchSensitivity
				, biasSensitivity = UserSettings.touchBiasSensitivity;
			
			// TODO: Change "distanceFromCenter" to "distanceFromInitialTouch"
			var distanceFromCenter = {
				x: 2 * ((touchPosition.x / elementSize.width) - 0.5)
				, y: 2 * ((touchPosition.y / elementSize.height) - 0.5)
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
			// This causes the user's touch to gravitate toward the center of the page,
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

			var touchState = this.touchState;

			if (touchState.primaryWeapon) state.primaryWeapon = true;
			if (touchState.secondaryWeapon) state.secondaryWeapon = true;
			if (touchState.accelerationX) state.accelerationX += touchState.accelerationX;
			if (touchState.accelerationY) state.accelerationY += touchState.accelerationY;
			if (touchState.engaged) state.engaged = true;

			touchState.accelerationX = 0;
			touchState.accelerationY = 0;
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
	function getTouchPosition(ev) {
		return { x: ev.clientX, y: ev.clientY };
	}

})();
