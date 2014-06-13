/*
 ng-mousemove="ui.onMouseMove($event)"
 ng-mousedown="ui.primaryWeapon(true); $event.preventDefault();"
 ng-mouseup="ui.primaryWeapon(false);"
 ng-mouseleave="ui.togglePause(true)"

 */

(function() {
	var UserSettings = {
		touchSensitivity: 2,
		inactiveTouchTimeout: 4
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
			ev.preventDefault();
			var touches = ev.changedTouches;
			for (var i = 0, l = touches.length; i < l; i++) {
				var touch = touches[i];
				if (!this.touchState.engaged) {
					this.touchState.engaged = { identifier: touch.identifier };
					var touchPosition = getTouchPosition(touch);
					this._updateTouchPosition(touchPosition);
				} else if (!this.touchState.primaryWeapon) {
					this.touchState.primaryWeapon = { identifier: touch.identifier };
				} else if (!this.touchState.secondaryWeapon) {
					this.touchState.secondaryWeapon = { identifier: touch.identifier };
				}
			}
		},
		_onTouchEnd: function(ev) {
			ev.preventDefault();
			var touches = ev.changedTouches;
			for (var i = 0, l = touches.length; i < l; i++) {
				var touch = touches[i];
				if (this.touchState.engaged && this.touchState.engaged.identifier === touch.identifier) {
					this.touchState.engaged = false;
				} else if (this.touchState.primaryWeapon && this.touchState.primaryWeapon.identifier === touch.identifier) {
					this.touchState.primaryWeapon = false;
				} else if (this.touchState.secondaryWeapon && this.touchState.secondaryWeapon.identifier === touch.identifier) {
					this.touchState.secondaryWeapon = false;
				}
			}
		},
		_onTouchMove: function(ev) {
			ev.preventDefault();
			var touches = ev.changedTouches;
			for (var i = 0, l = touches.length; i < l; i++) {
				var touch = touches[i];
				if (this.touchState.engaged && this.touchState.engaged.identifier === touch.identifier) {
					var touchPosition = getTouchPosition(touch);
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
			var sensitivity = UserSettings.touchSensitivity;
			var acceleration = {
				x: delta.x * sensitivity
				, y: delta.y * sensitivity
			};
			return acceleration;
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
	function getTouchPosition(touch) {
		return { x: touch.clientX, y: touch.clientY };
	}

})();
