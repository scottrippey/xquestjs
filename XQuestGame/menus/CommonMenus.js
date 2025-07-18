import { Balance } from "@/XQuestGame/options/Balance.js";
import { GraphicsTestMenu } from "@/XQuestGame/menus/GraphicsTestMenu.js";
import { BaseMenu } from "./BaseMenu.js";
import { MenuEvents } from "../scenes/MenuScene.js";

export const CommonMenus = {
  GraphicsTestMenu,

  PauseMenu: class PauseMenu extends BaseMenu {
    constructor(menuScene) {
      super(menuScene);
      const pauseOverlay = this.menuScene.gfx.createPauseOverlay();
      pauseOverlay.showPauseOverlay();
    }
    getRows() {
      return [
        this.createMenuButton("Resume Game", this._onResumeGame.bind(this)),
        this.createMenuButton("Game Options", this._showGameOptions.bind(this)),
      ];
    }
    _onResumeGame() {
      this.menuScene.exitMenu().queue(() => {
        this.menuScene.fireSceneEvent(MenuEvents.onResumeGame);
      });
    }
    _showGameOptions() {
      this.menuScene.addMenu(new CommonMenus.GameOptions(this.menuScene));
    }
  },

  GameOptions: class GameOptions extends BaseMenu {
    getRows() {
      return [
        this.createMenuButton("Input Settings", this._showInputSettings.bind(this)),
        this.createMenuButton("Difficulty", this._showDifficultyMenu.bind(this)),
        this.createMenuButton("Graphics Test", this._showGraphicsTest.bind(this)),
        this.createMenuButton("Quit XQuest", this._showQuitConfirm.bind(this)),
        this.createMenuButton("Back", this.menuScene.goBack.bind(this.menuScene)),
      ];
    }
    _showInputSettings() {
      this.menuScene.addMenu(new CommonMenus.InputSettings(this.menuScene));
    }
    _showGraphicsTest() {
      this.menuScene.addMenu(new CommonMenus.GraphicsTestMenu(this.menuScene));
    }
    _showDifficultyMenu() {
      this.menuScene.addMenu(new CommonMenus.DifficultySettings(this.menuScene));
    }
    _showQuitConfirm() {
      this.menuScene.addMenu(new CommonMenus.ConfirmQuitGame(this.menuScene));
    }
  },

  InputSettings: class InputSettings extends BaseMenu {
    getRows() {
      return [
        this.createMenuButton("Mouse", this._showMouseSensitivity.bind(this)),
        this.createMenuButton("Keyboard", this._showKeyboardSensitivity.bind(this)),
        this.createMenuButton("Touch", this._showTouchSensitivity.bind(this)),
        this.createMenuButton("Back", this.menuScene.goBack.bind(this.menuScene)),
      ];
    }
    _showMouseSensitivity() {
      this.menuScene.addMenu(new CommonMenus.MouseSettings(this.menuScene));
    }
    _showKeyboardSensitivity() {
      this.menuScene.addMenu(new CommonMenus.KeyboardSettings(this.menuScene));
    }
    _showTouchSensitivity() {
      this.menuScene.addMenu(new CommonMenus.TouchSettings(this.menuScene));
    }
  },

  DifficultySettings: class DifficultySettings extends BaseMenu {
    getRows() {
      return [
        this.createMenuButton("Easy", () => {
          Balance.setGameMode("easy");
          this.menuScene.goBack();
        }),
        this.createMenuButton("Normal", () => {
          Balance.setGameMode("normal");
          this.menuScene.goBack();
        }),
        this.createMenuButton("Crazy Hard", () => {
          Balance.setGameMode("hard");
          this.menuScene.goBack();
        }),
      ];
    }
  },

  MouseSettings: class MouseSettings extends BaseMenu {
    onMenuLeave() {
      this.menuScene.host.settings.saveSetting("mouseSettings", this.mouseSettings);
    }
    getRows() {
      let mouseSettings = (this.mouseSettings =
        this.menuScene.host.settings.retrieveSetting("mouseSettings"));

      const sensitivity = this.createMenuButton(
        () => `Sensitivity: ${mouseSettings.mouseSensitivity}`,
        () => {
          mouseSettings.mouseSensitivity =
            (mouseSettings.mouseSensitivity % mouseSettings.maxMouseSensitivity) + 1;
          sensitivity.updateText();
        },
      );
      const bias = this.createMenuButton(
        () => `Edge Sensitivity: ${mouseSettings.mouseBiasSensitivity}`,
        () => {
          mouseSettings.mouseBiasSensitivity =
            (mouseSettings.mouseBiasSensitivity % mouseSettings.maxMouseBias) + 1;
          bias.updateText();
        },
      );
      const reset = this.createMenuButton("Reset", () => {
        mouseSettings = this.mouseSettings = this.menuScene.host.settings.saveSetting(
          "mouseSettings",
          null,
        );
        rows.forEach((row) => {
          row.updateText && row.updateText();
        });
      });

      const rows = [
        sensitivity,
        bias,
        reset,
        this.createMenuButton("Back", this.menuScene.goBack.bind(this.menuScene)),
      ];
      return rows;
    }
  },

  KeyboardSettings: class KeyboardSettings extends BaseMenu {
    onMenuLeave() {
      this.menuScene.host.settings.saveSetting("keyboardSettings", this.keyboardSettings);
    }
    getRows() {
      let keyboardSettings = (this.keyboardSettings =
        this.menuScene.host.settings.retrieveSetting("keyboardSettings"));

      const sensitivity = this.createMenuButton(
        () => `Sensitivity: ${keyboardSettings.keyboardSensitivity}`,
        () => {
          keyboardSettings.keyboardSensitivity =
            (keyboardSettings.keyboardSensitivity % keyboardSettings.maxKeyboardSensitivity) + 1;
          sensitivity.updateText();
        },
      );
      const reset = this.createMenuButton("Reset", () => {
        keyboardSettings = this.keyboardSettings = this.menuScene.host.settings.saveSetting(
          "keyboardSettings",
          null,
        );
        rows.forEach((row) => {
          row.updateText && row.updateText();
        });
      });

      const rows = [
        sensitivity,
        reset,
        this.createMenuButton("Back", this.menuScene.goBack.bind(this.menuScene)),
      ];
      return rows;
    }
  },

  TouchSettings: class TouchSettings extends BaseMenu {
    onMenuLeave() {
      this.menuScene.host.settings.saveSetting("touchSettings", this.touchSettings);
    }
    getRows() {
      let touchSettings = (this.touchSettings =
        this.menuScene.host.settings.retrieveSetting("touchSettings"));

      const sensitivity = this.createMenuButton(
        () => `Sensitivity: ${touchSettings.touchSensitivity}`,
        () => {
          touchSettings.touchSensitivity =
            (touchSettings.touchSensitivity % touchSettings.maxTouchSensitivity) + 1;
          sensitivity.updateText();
        },
      );
      const reset = this.createMenuButton("Reset", () => {
        touchSettings = this.touchSettings = this.menuScene.host.settings.saveSetting(
          "touchSettings",
          null,
        );
        rows.forEach((row) => {
          row.updateText && row.updateText();
        });
      });

      const rows = [
        sensitivity,
        reset,
        this.createMenuButton("Back", this.menuScene.goBack.bind(this.menuScene)),
      ];
      return rows;
    }
  },

  ConfirmQuitGame: class ConfirmQuitGame extends BaseMenu {
    getRows() {
      const rows = [
        this.createMenuButton("Quit XQuest", () => this.menuScene.host.quitGame()),
        this.createMenuButton("Back", () => this.menuScene.goBack()),
      ];
      return rows;
    }
  },
};
