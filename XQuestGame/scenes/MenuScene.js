import { Class } from "@/common/src/Smart/Smart.Class.js";
import { BaseScene } from "./BaseScene.js";
import { StartMenu } from "../menus/StartMenu.js";
import { CommonMenus } from "../menus/CommonMenus.js";

export const MenuSceneInputs = {
  menuUp: "menuUp",
  menuDown: "menuDown",
  menuLeft: "menuLeft",
  menuRight: "menuRight",
  menuInvoke: "menuInvoke",
  menuBack: "menuBack",
};

export const MenuEvents = {
  onResumeGame: "onResumeGame",
  onStartGame: "onStartGame",
};

const MenuSceneEventMap = MenuEvents;

export const MenuScene = Class(new BaseScene().implementSceneEvents(MenuSceneEventMap), {
  initialize: function MenuScene(gfx, host) {
    this.MenuScene_initialize(gfx, host);
  },
  MenuScene_initialize(gfx, host) {
    this.BaseScene_initialize();

    this.gfx = gfx;
    this.host = host;
    this.menuScene = this; // For consistency
    this.addSceneItem(this);
    this.addSceneItem(this.gfx);

    this.menuStack = [];
  },

  _setupBackButton() {
    const backButton = this.menuScene.gfx.createMenuButton("Back");
    backButton.addButtonEvents({
      invoke: this.goBack.bind(this),
    });
    const top = this.menuScene.gfx.getHudPoint("top");
    backButton.moveTo(top.x, top.y + backButton.visibleHeight);

    this.backButton = backButton;
    this.backButton.visible = false;
  },
  _updateBackButton() {
    if (!this.backButton) return;

    this.backButton.visible = this.menuStack.length >= 2;
  },

  getDefaultInputState() {
    const state = {
      menuMode: true,
    };
    return state;
  },

  addMenu(menu) {
    if (this.currentMenu) this.currentMenu.menuLeave(false);

    this.menuStack.push(menu);
    this.currentMenu = menu;

    this._updateBackButton();
    this.currentMenu.menuEnter(false);
  },
  goBack() {
    if (this.menuStack.length <= 1) return;

    this.menuStack.pop().menuLeave(true);

    this.currentMenu = this.menuStack[this.menuStack.length - 1];
    this.currentMenu.menuEnter(true);

    this._updateBackButton();
  },
  exitMenu() {
    this.menuStack.length = 0;
    return this.currentMenu.menuLeave(true);
  },

  onMove(tickEvent, inputState) {
    this.currentMenu.menuInput(inputState);

    if (inputState.menuBack && this.menuStack.length >= 2) {
      this.goBack();
    }
  },

  showStartMenu() {
    const startMenu = new StartMenu(this.menuScene);
    this.addMenu(startMenu);
  },
  showPauseMenu() {
    const pauseMenu = new CommonMenus.PauseMenu(this.menuScene);
    this.addMenu(pauseMenu);
  },
});
