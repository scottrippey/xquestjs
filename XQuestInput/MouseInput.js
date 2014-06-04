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

	XQuestInput.MouseInput = Smart.Class({
		element: null,
		mouseState: null,

		initialize: function(element) {
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
		},

		_onMouseOver: function(ev) {
			var isInsideElement = elementContains(this.element, ev.target);
			if (isInsideElement) {
				this.mouseState.engaged = true;
			}
		},
		_onMouseOut: function(ev) {
			var isInsideElement = elementContains(this.element, ev.target);
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
			var mousePosition = getMousePosition(ev);
			var previousMousePosition = this.previousMousePosition;
			this.previousMousePosition = mousePosition;

			if (!previousMousePosition) {
				return;
			}

			var deltaX = mousePosition.x - previousMousePosition.x,
				deltaY = mousePosition.y - previousMousePosition.y;

			this.mouseState.accelerationX += deltaX;
			this.mouseState.accelerationY += deltaY;
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
