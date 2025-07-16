import { Class } from "@/common/src/Smart/Smart.Class.js";
import { Disposable } from "@/common/src/Smart/Smart.Disposable.js";
import { MenuSceneInputs } from "@/XQuestGame/scenes/MenuScene.js";

/* Gamepad input for Xbox One */

const UserSettings = {
  analogThreshold: 0.05,
  analogSensitivity: 8,
  analogDownThreshold: 0.6,
  analogUpThreshold: 0.4,
};
const MenuActions = MenuSceneInputs;
const MenuActionsAnalogX = "MenuActionsAnalogX";
const MenuActionsAnalogY = "MenuActionsAnalogY";
const PlayerActions = {
  pauseGame: "pauseGame",
  analogX: "analogX",
  analogY: "analogY",
  primaryWeapon: "primaryWeapon",
  secondaryWeapon: "secondaryWeapon",
};

export const PlayerInputGamepad = Class(new Disposable(), {
  initialize: function PlayerInputGamepad() {
    this.allGamepads = [];

    this._disableAllKeystrokes();
  },
  setGame(game) {
    this.game = game || null;
  },
  addGamepad(gamepadId, gamepad) {
    gamepad.gamepadId = gamepadId;
    this.allGamepads.push(gamepad);
  },
  removeGamepad(gamepadId) {
    for (let i = 0; i < this.allGamepads.length; i++) {
      if (this.allGamepads[i].gamepadId === gamepadId) {
        this.allGamepads.splice(i, 1);
        return;
      }
    }
  },
  onInput(tickEvent, inputState) {
    if (inputState.menuMode) {
      this._onInput_menu(tickEvent, inputState);
    } else {
      this._onInput_player(tickEvent, inputState);
    }
  },
  _onInput_menu(tickEvent, inputState) {
    const allGamepads = this.allGamepads;

    for (let i = 0; i < allGamepads.length; i++) {
      const gamepad = allGamepads[i];

      const downQueue = gamepad.getMenuActions();
      for (let j = 0; j < downQueue.length; j++) {
        let downKey = downQueue[j];
        inputState[downKey] = true;

        if ((downKey = MenuActions.menuInvoke)) {
          this.currentGamepad = gamepad;
        }
      }
    }
  },
  _onInput_player(tickEvent, inputState) {
    const analogSensitivity = UserSettings.analogSensitivity;
    const analogThreshold = UserSettings.analogThreshold;
    const currentGamepad = this.currentGamepad;

    if (!currentGamepad) return;

    const actions = currentGamepad.getPlayerActions();
    if (actions[PlayerActions.primaryWeapon]) inputState.primaryWeapon = true;
    if (actions[PlayerActions.secondaryWeapon]) inputState.secondaryWeapon = true;
    if (actions[PlayerActions.pauseGame]) {
      if (!this.isPauseDown) {
        this.isPauseDown = true;
        if (this.game) this.game.pauseGame(true);
      }
    } else {
      this.isPauseDown = false;
    }

    const analogX = actions[PlayerActions.analogX];
    const analogY = -actions[PlayerActions.analogY];
    if (Math.abs(analogX) > analogThreshold || Math.abs(analogY) > analogThreshold) {
      inputState.accelerationX += analogX * analogSensitivity;
      inputState.accelerationY += analogY * analogSensitivity;
    }
  },
  _disableAllKeystrokes() {
    const useCapture = true;
    document.addEventListener("keydown", stopEvent, useCapture);
    document.addEventListener("keyup", stopEvent, useCapture);
    document.addEventListener("keypress", stopEvent, useCapture);
    this.onDispose(() => {
      document.removeEventListener("keydown", stopEvent, useCapture);
      document.removeEventListener("keyup", stopEvent, useCapture);
      document.removeEventListener("keypress", stopEvent, useCapture);
    });

    function stopEvent(ev) {
      ev.preventDefault();
      ev.stopPropagation();
    }
  },
}).extend({
  /**
   * (returns null if not supported)
   */
  createGamepadInput,
});

const xboxPlayerMap = {
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
  isRightThumbstickPressed: PlayerActions.primaryWeapon,
};
const xboxMenuMap = {
  //isMenuPressed: MenuActions.menuInvoke,
  //isViewPressed: MenuActions.menuInvoke,

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
  leftThumbstickY: MenuActionsAnalogY,
  //isLeftThumbstickPressed: ,

  //rightThumbstickX: ,
  //rightThumbstickY: ,
  //isRightThumbstickPressed:
};

export const XboxGamepadMapper = Class({
  initialize: function XboxGamepadMapper(xboxGamepad, playerMap, menuMap) {
    this.xboxGamepad = xboxGamepad;
    this.playerMap = playerMap;
    this.menuMap = menuMap;
    this.previousActions = {};
  },
  getPlayerActions() {
    return this._mapXboxGamepadActions(this.playerMap);
  },
  getMenuActions() {
    const currentActionValues = this._mapXboxGamepadActions(this.menuMap);

    const previousActionValues = this.previousActions;
    this.previousActions = currentActionValues;

    const menuActions = [];
    for (const actionName in currentActionValues) {
      if (!Object.hasOwn(currentActionValues, actionName)) continue;
      const previousValue = previousActionValues[actionName];
      let currentValue = currentActionValues[actionName];

      // Deal with analog inputs:
      if (actionName === MenuActionsAnalogX) {
        const wasDownX = this.isDownX;
        this.isDownX = this._analogToBoolean(Math.abs(currentValue), wasDownX);
        if (!wasDownX && this.isDownX) {
          menuActions.push(currentValue < 0 ? MenuActions.menuLeft : MenuActions.menuRight);
        }
      } else if (actionName === MenuActionsAnalogY) {
        currentValue = -currentValue;
        const wasDownY = this.isDownY;
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
  },
  _mapXboxGamepadActions(actionsMap) {
    const currentReading = this.xboxGamepad.getCurrentReading();
    const gamepadActions = {};
    for (const gamepadButtonName in actionsMap) {
      if (!Object.hasOwn(actionsMap, gamepadButtonName)) continue;

      const actionName = actionsMap[gamepadButtonName];
      const readingValue = currentReading[gamepadButtonName];

      if (readingValue !== false) {
        gamepadActions[actionName] = readingValue;
      }
    }

    return gamepadActions;
  },
  _analogToBoolean(analogValue, wasAlreadyDown) {
    const threshold = wasAlreadyDown
      ? UserSettings.analogUpThreshold
      : UserSettings.analogDownThreshold;
    return analogValue >= threshold;
  },
});

function createGamepadInput() {
  const Windows = window.Windows;
  const Xbox = Windows && Windows.Xbox;
  if (!Xbox) return null;
  const gamepadInput = new PlayerInputGamepad();
  function addXboxGamepad(xboxGamepad) {
    const gamepad = new XboxGamepadMapper(xboxGamepad, xboxPlayerMap, xboxMenuMap);
    gamepadInput.addGamepad(xboxGamepad.id, gamepad);
  }

  function removeXboxGamepad(xboxGamepad) {
    gamepadInput.removeGamepad(xboxGamepad.id);
  }

  // Add existing gamepads:
  const Input = Xbox.Input;

  const Gamepad = Input.Gamepad;
  const gamepads = Gamepad.gamepads;
  for (let i = 0; i < gamepads.size; i++) {
    addXboxGamepad(gamepads[i]);
  }

  function onGamepadAdded(eventArgs) {
    addXboxGamepad(eventArgs.gamepad);
  }

  function onGamepadRemoved(eventArgs) {
    removeXboxGamepad(eventArgs.gamepad);
  }

  Gamepad.addEventListener("gamepadadded", onGamepadAdded);
  Gamepad.addEventListener("gamepadremoved", onGamepadRemoved);
  gamepadInput.onDispose(() => {
    Gamepad.removeEventListener("gamepadadded", onGamepadAdded);
    Gamepad.removeEventListener("gamepadremoved", onGamepadRemoved);
  });

  return gamepadInput;
}
