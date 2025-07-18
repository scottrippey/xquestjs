import { Events } from "common/src/Smart/Smart.Events";
import { BaseScene } from "./BaseScene.js";
import { MenuScene } from "./MenuScene.js";
import { ArcadeGame } from "./ArcadeGame.js";

const HostSceneEvents = {
  onMenuCreated: "onMenuCreated",
  onGameCreated: "onGameCreated",
  onQuitGame: "onQuitGame",
};

export class HostScene extends BaseScene {
  constructor(gfx, settings) {
    super();

    this.gfx = gfx;
    this.addSceneItem(gfx);
    this.settings = settings;

    this.host = this; // For consistency

    this._setupBackground();
  }
  _setupBackground() {
    this.gfx.showBackgroundStars(true);

    const middle = this.gfx.getGamePoint("middle");
    this.gfx.followPlayer(middle);
  }
  start() {
    this._showStartMenu();
  }
  _showStartMenu() {
    const menuScene = this.createMenuScene();

    this.setChildScene(menuScene);

    menuScene.onStartGame(() => {
      menuScene.dispose();
      this._startArcadeGame();
    });
    menuScene.showStartMenu();
  }
  createMenuScene() {
    const gfx = this.gfx.createNewGraphics();
    const menuScene = new MenuScene(gfx, this.host);
    this.fireSceneEvent(HostSceneEvents.onMenuCreated, [menuScene]);

    return menuScene;
  }
  _startArcadeGame() {
    const gfx = this.gfx.createNewGraphics();
    const arcadeGame = new ArcadeGame(gfx, this.host);
    this.fireSceneEvent(HostSceneEvents.onGameCreated, [arcadeGame]);
    this.setChildScene(arcadeGame);

    arcadeGame.onGameOver(() => {
      arcadeGame.dispose();
      this._showStartMenu();
    });

    arcadeGame.startArcadeGame();
  }
  quitGame() {
    this.fireSceneEvent(HostSceneEvents.onQuitGame);
  }
}
HostScene.implementEventMethods(HostSceneEvents);
