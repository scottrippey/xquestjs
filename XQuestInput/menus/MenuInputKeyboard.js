import { KeyMapper } from "../player/PlayerInputKeyboard.js";
import { MenuSceneInputs } from "../../XQuestGame/scenes/MenuScene.js";

const menuKeyMap = {
  up: MenuSceneInputs.menuUp,
  down: MenuSceneInputs.menuDown,
  left: MenuSceneInputs.menuLeft,
  right: MenuSceneInputs.menuRight,
  enter: MenuSceneInputs.menuInvoke,
  escape: MenuSceneInputs.menuBack,
  backspace: MenuSceneInputs.menuBack,
};

export class MenuInputKeyboard {
  constructor(element) {
    this.element = element || document;
    this.actionsQueue = [];
    this._setupKeyMap();

    this.keyMapper.setKeyMap(menuKeyMap);
  }
  _setupKeyMap() {
    this.keyMapper = new KeyMapper(this.element, this._onActionDown.bind(this));
  }
  _onActionDown(actionName) {
    this.actionsQueue.push(actionName);
  }
  onInput(tickEvent, inputState) {
    for (let i = 0, l = this.actionsQueue.length; i < l; i++) {
      const actionName = this.actionsQueue[i];
      inputState[actionName] = true;
    }
    this.actionsQueue.length = 0;
  }
}
