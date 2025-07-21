import "./side-effects.js";
import { Disposable } from "@/Tools/Smart.Disposable.js";
import { Balance } from "@/XQuestGame/options/Balance.js";
import { DemoScene } from "@/XQuestGame/scenes/DemoScene.js";
import { HostScene } from "@/XQuestGame/scenes/HostScene.js";
import { EaselJSGraphics } from "@/XQuestGraphics/EaselJS/EaselJSGraphics.js";
import { EaselJSTimer } from "@/XQuestGraphics/EaselJS/EaselJSTimer.js";
import { Settings } from "@/XQuestHost/Settings.js";
import { MenuInputKeyboard } from "@/XQuestInput/menus/MenuInputKeyboard.js";
import { PlayerInputGamepad } from "@/XQuestInput/player/PlayerInputGamepad.js";
import { PlayerInputKeyboard } from "@/XQuestInput/player/PlayerInputKeyboard.js";
import { PlayerInputMouse } from "@/XQuestInput/player/PlayerInputMouse.js";
import { PlayerInputTouch } from "@/XQuestInput/player/PlayerInputTouch.js";

export class XQuestHost extends Disposable {
  constructor({ canvas = null, scene = null } = {}) {
    super();
    Balance.setGameMode("arcade");
    this._setupCanvas(canvas);
    this._setupGraphics();
    this._setupTimer();
    this._setupSettings();

    this._setupGamepad();

    if (scene) {
      this._startScene(scene);
    } else {
      this._startHostScene();
    }
  }
  _setupCanvas(canvas) {
    if (!canvas) {
      const bounds = Balance.level.bounds;
      canvas = this._createCanvas(bounds.visibleWidth, bounds.visibleHeight);
    }
    this.canvas = canvas;
  }
  _setupGraphics() {
    this.graphics = new EaselJSGraphics(this.canvas);
  }
  _createCanvas(canvasWidth, canvasHeight) {
    // Note: create elements manually (parsing isn't "safe" for WinJS)

    // Create the container:
    const container = document.createElement("section");
    container.setAttribute("tabindex", "0");
    Object.assign(container.style, {
      cursor: "pointer",
    });

    // Create the canvas:
    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    container.appendChild(canvas);

    this.canvas = canvas;
    this.container = container;
    return canvas;
  }
  /**
   * Fills the canvas to fit the entire browser window
   */
  enterFullSize() {
    const container = this.container;
    const canvas = this.canvas;

    Object.assign(container.style, {
      position: "fixed",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      backgroundColor: "hsl(0, 0%, 5%)",
      outline: "none",
    });
    Object.assign(canvas.style, {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      margin: "auto",
    });

    // Append container to body:
    document.body.appendChild(container);
    document.body.style.overflow = "hidden";
    this.onDispose(() => {
      document.body.removeChild(container);
      document.body.style.overflow = null;
    });

    // Setup the letterboxing effect:
    this._contain(container, canvas, canvas.width, canvas.height);

    container.focus();
  }
  _contain(container, canvas, canvasWidth, canvasHeight) {
    window.addEventListener("resize", scaleCanvas);
    this.onDispose(() => {
      window.removeEventListener("resize", scaleCanvas);
    });
    scaleCanvas();

    function scaleCanvas() {
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;
      const canvasWidthRatio = canvasWidth / canvasHeight;
      const containerWidthRatio = containerWidth / containerHeight;
      if (canvasWidthRatio > containerWidthRatio) {
        canvas.style.width = `${containerWidth}px`;
        canvas.style.height = `${containerWidth / canvasWidthRatio}px`;
      } else {
        canvas.style.height = `${containerHeight}px`;
        canvas.style.width = `${containerHeight * canvasWidthRatio}px`;
      }
    }
  }
  _setupTimer() {
    this.timer = new EaselJSTimer();
    this.timer.addTickHandler(this._tickHandler.bind(this));
    this.onDispose(() => {
      this.timer.dispose();
    });
  }
  _tickHandler(tickEvent) {
    // timeAdjust is currrently unused, but can be set in the console for testing purposes
    if (this.timeAdjust) {
      tickEvent.deltaSeconds *= this.timeAdjust;
    }

    this.hostScene.updateScene(tickEvent);
  }
  _setupSettings() {
    this.settings = new Settings();
  }
  _setupGamepad() {
    this.gamepadInput = PlayerInputGamepad.createGamepadInput() || null;
    if (this.gamepadInput) {
      this.onDispose(() => {
        this.gamepadInput.dispose();
      });
    }
  }
  _startHostScene() {
    this.hostScene = new HostScene(this.graphics, this.settings);

    // Setup Inputs:
    this.hostScene.onMenuCreated(this._addMenuInputs.bind(this));
    this.hostScene.onGameCreated(this._addPlayerInputs.bind(this));
    this.hostScene.onQuitGame(() => {
      this.dispose();
    });

    this.hostScene.start();

    this.onDispose(() => {
      this.hostScene.dispose();
    });
  }
  _startScene(scene) {
    switch (scene.name) {
      case "DemoScene":
        this._startDemoScene(scene.component);
        break;
      default:
        throw new Error(`Unknown scene name: "${scene.name}"`);
    }
  }
  _startDemoScene(component) {
    const scene = new DemoScene(this.graphics, this.settings, component);
    scene.start();
    this.onDispose(() => {
      scene.dispose();
    });
    this.hostScene = scene;
  }
  _addMenuInputs(menuScene) {
    menuScene.addSceneItem(new MenuInputKeyboard(null));
    if (this.gamepadInput) {
      menuScene.addSceneItem(this.gamepadInput);
    }
  }
  _addPlayerInputs(arcadeGame) {
    arcadeGame.addSceneItem(new PlayerInputKeyboard(arcadeGame, null, this.settings));
    arcadeGame.addSceneItem(
      new PlayerInputMouse(arcadeGame, this.canvas.parentNode, this.settings),
    );
    arcadeGame.addSceneItem(
      new PlayerInputTouch(arcadeGame, this.canvas.parentNode, this.settings),
    );
    if (this.gamepadInput) {
      arcadeGame.addSceneItem(this.gamepadInput);
      this.gamepadInput.setGame(arcadeGame);
    }
  }
  enterFullScreen() {
    requestFullscreen(this.container);
  }
}

function requestFullscreen(elem) {
  (
    elem.requestFullscreen ||
    elem.webkitRequestFullscreen ||
    elem.mozRequestFullScreen ||
    elem.msRequestFullscreen
  ).call(elem);
}
