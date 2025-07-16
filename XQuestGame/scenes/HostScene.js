import { Class } from "@/common/src/Smart/Smart.Class.js";

const HostSceneEvents = {
  onMenuCreated: "onMenuCreated",
  onGameCreated: "onGameCreated",
  onQuitGame: "onQuitGame",
};

export const HostScene = Class(new XQuestGame.BaseScene().implementSceneEvents(HostSceneEvents), {
  initialize: function HostScene(gfx, settings) {
    this.BaseScene_initialize();

    this.gfx = gfx;
    this.addSceneItem(gfx);
    this.settings = settings;

    this.host = this; // For consistency

    this._setupBackground();
  },
  _setupBackground() {
    this.gfx.showBackgroundStars(true);

    const middle = this.gfx.getGamePoint("middle");
    this.gfx.followPlayer(middle);
  },
  start() {
    this._showStartMenu();
  },
  _showStartMenu() {
    const menuScene = this.createMenuScene();

    this.setChildScene(menuScene);

    menuScene.onStartGame(() => {
      menuScene.dispose();
      this._startArcadeGame();
    });
    menuScene.showStartMenu();
  },
  createMenuScene() {
    const gfx = this.gfx.createNewGraphics();
    const menuScene = new XQuestGame.MenuScene(gfx, this.host);
    this.fireSceneEvent(HostSceneEvents.onMenuCreated, [menuScene]);

    return menuScene;
  },
  _startArcadeGame() {
    const gfx = this.gfx.createNewGraphics();
    const arcadeGame = new XQuestGame.ArcadeGame(gfx, this.host);
    this.fireSceneEvent(HostSceneEvents.onGameCreated, [arcadeGame]);
    this.setChildScene(arcadeGame);

    arcadeGame.onGameOver(() => {
      arcadeGame.dispose();
      this._showStartMenu();
    });

    arcadeGame.startArcadeGame();
  },
  quitGame() {
    this.fireSceneEvent(HostSceneEvents.onQuitGame);
  },
});
