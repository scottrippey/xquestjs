import { Class } from "@/common/src/Smart/Smart.Class";

(() => {
  const menuKeyMap = {
    up: XQuestGame.MenuSceneInputs.menuUp,
    down: XQuestGame.MenuSceneInputs.menuDown,
    left: XQuestGame.MenuSceneInputs.menuLeft,
    right: XQuestGame.MenuSceneInputs.menuRight,
    enter: XQuestGame.MenuSceneInputs.menuInvoke,
    escape: XQuestGame.MenuSceneInputs.menuBack,
    backspace: XQuestGame.MenuSceneInputs.menuBack,
  };

  XQuestInput.MenuInputKeyboard = Class({
    initialize: function MenuInputKeyboard(element) {
      this.element = element || document;
      this.actionsQueue = [];
      this._setupKeyMap();

      this.keyMapper.setKeyMap(menuKeyMap);
    },
    _setupKeyMap() {
      this.keyMapper = new XQuestInput.KeyMapper(this.element, this._onActionDown.bind(this));
    },
    _onActionDown(actionName) {
      this.actionsQueue.push(actionName);
    },
    onInput(tickEvent, inputState) {
      for (let i = 0, l = this.actionsQueue.length; i < l; i++) {
        const actionName = this.actionsQueue[i];
        inputState[actionName] = true;
      }
      this.actionsQueue.length = 0;
    },
  });
})();
