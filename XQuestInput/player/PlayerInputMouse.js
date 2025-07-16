(function _init_PlayerInputMouse() {
  const primaryWeapon = "primaryWeapon";
  const secondaryWeapon = "secondaryWeapon";
  const mouseMap = {
    left: primaryWeapon,
    right: secondaryWeapon,
  };

  XQuestInput.PlayerInputMouse = Smart.Class({
    element: null,
    elementSize: null,
    mouseState: null,
    previousMousePosition: null,

    initialize: function PlayerInputMouse(game, element, settings) {
      this.game = game;
      this.element = element;
      this.mouseMap = mouseMap;

      settings.watchSetting("mouseSettings", (mouseSettings) => {
        this.mouseSettings = mouseSettings;
      });

      addEventListeners(this.element, {
        mouseover: this._onMouseOver.bind(this),
        mouseout: this._onMouseOut.bind(this),
        mousedown: this._onMouseDown.bind(this),
        mouseup: this._onMouseUp.bind(this),
        mousemove: this._onMouseMove.bind(this),
      });

      addEventListeners(window, {
        resize: this._onWindowResize.bind(this),
      });
      this._onWindowResize();

      this.game.onGamePaused(this._onGamePaused.bind(this));
      this._onGamePaused(false);

      this._resetMouseState();
    },
    _resetMouseState() {
      this.mouseState = { engaged: true, accelerationX: 0, accelerationY: 0 };
    },

    _onWindowResize() {
      this.elementSize = getElementSize(this.element);
      this.previousMousePosition = null;
    },

    _onGamePaused(paused) {
      this.element.style.cursor = paused ? "pointer" : "none";
      this.previousMousePosition = null;
      this._resetMouseState();
    },

    _onMouseOver(ev) {
      const currentMouseOver = ev.target;
      const mouseIsIn = elementContains(this.element, currentMouseOver);
      if (mouseIsIn) {
        this.mouseState.engaged = true;
      }
    },
    _onMouseOut(ev) {
      const currentMouseOver = ev.relatedTarget;
      const mouseIsOut = !elementContains(this.element, currentMouseOver);
      if (mouseIsOut) {
        this.mouseState.engaged = false;
        this.game.pauseGame(true);
      }
    },
    _onMouseDown(ev) {
      const button = getMouseButton(ev);
      const action = this.mouseMap[button];
      if (action) {
        this.mouseState[action] = true;
        ev.preventDefault();
      }
    },
    _onMouseUp(ev) {
      const button = getMouseButton(ev);
      const action = this.mouseMap[button];
      if (action) {
        this.mouseState[action] = false;
      }
    },

    _onMouseMove(ev) {
      const mousePosition = getMousePosition(ev);
      const previousMousePosition = this.previousMousePosition;
      const mouseSettings = this.mouseSettings;
      this.previousMousePosition = mousePosition;
      if (!previousMousePosition) return;

      const delta = {
        x: Math.min(mousePosition.x - previousMousePosition.x, mouseSettings.maxMouseMove),
        y: Math.min(mousePosition.y - previousMousePosition.y, mouseSettings.maxMouseMove),
      };

      const acceleration = this._adjustForSensitivity(delta, mousePosition);

      this.mouseState.accelerationX += acceleration.x;
      this.mouseState.accelerationY += acceleration.y;
    },
    _adjustForSensitivity(delta, mousePosition) {
      const elementSize = this.elementSize;
      const mouseSettings = this.mouseSettings;
      const sensitivity = mouseSettings.mouseSensitivity * mouseSettings.sensitivityMultiplier;
      const biasSensitivity = mouseSettings.mouseBiasSensitivity * mouseSettings.biasMultiplier;
      const screenDeltaX = delta.x / elementSize.width;
      const screenDeltaY = delta.y / elementSize.height;
      const distanceFromCenterX = 2 * (mousePosition.x / elementSize.width) - 1;
      const distanceFromCenterY = 2 * (mousePosition.y / elementSize.height) - 1;
      const biasX = this._getBias(distanceFromCenterX, delta.x, biasSensitivity);
      const biasY = this._getBias(distanceFromCenterY, delta.y, biasSensitivity);

      const acceleration = {
        x: screenDeltaX * sensitivity * biasX,
        y: screenDeltaY * sensitivity * biasY,
      };

      return acceleration;
    },
    _getBias(distanceFromCenter, deltaDirection, sensitivity) {
      // "Bias" is used to increase outward sensitivity, and decrease inward sensitivity.
      // This causes the user's mouse to gravitate toward the center of the page,
      // decreasing the likelihood of reaching the edges of the page.

      const isMovingAwayFromCenter =
        (distanceFromCenter < 0 && deltaDirection < 0) ||
        (distanceFromCenter > 0 && deltaDirection > 0);
      distanceFromCenter = Math.abs(distanceFromCenter);
      if (isMovingAwayFromCenter) {
        return 1 + distanceFromCenter * (sensitivity - 1);
      } else {
        return 1 - distanceFromCenter + distanceFromCenter / sensitivity;
      }
    },

    onInput(tickEvent, inputState) {
      const mouseState = this.mouseState;

      if (mouseState.primaryWeapon) inputState.primaryWeapon = true;
      if (mouseState.secondaryWeapon) inputState.secondaryWeapon = true;
      if (mouseState.accelerationX) inputState.accelerationX += mouseState.accelerationX;
      if (mouseState.accelerationY) inputState.accelerationY += mouseState.accelerationY;
      if (mouseState.engaged) inputState.engaged = true;

      mouseState.accelerationX = 0;
      mouseState.accelerationY = 0;
    },
  });

  function addEventListeners(element, events) {
    for (const eventName in events) {
      if (!Object.hasOwn(events, eventName)) continue;
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
      case 1:
        return "left";
      case 2:
        return "middle";
      case 3:
        return "right";
      case 4:
        return "xbutton1";
      case 5:
        return "xbutton2";
      default:
        return "none";
    }
  }
})();
