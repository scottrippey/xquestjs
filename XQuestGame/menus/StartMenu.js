import { MenuEvents } from "../scenes/MenuScene.js";
import { BaseMenu } from "./BaseMenu.js";
import { CommonMenus } from "./CommonMenus.js";

export class StartMenu extends BaseMenu {
  constructor(menuScene) {
    super(menuScene);
  }
  getRows() {
    const xQuestLogo = this._createLogo();
    return [
      xQuestLogo,
      this.createMenuButton("Play xQuest", this._startGame.bind(this)),
      this.createMenuButton("Game Options", this._showGameOptions.bind(this)),
    ];
  }
  _createLogo() {
    const logo = this.menuScene.gfx.createXQuestLogoGraphic();

    logo.setActive = false; // Ensure it's not selectable

    this.logo = logo;
    return logo;
  }
  _startGame() {
    this.menuScene.exitMenu().queue(() => {
      this.menuScene.fireSceneEvent(MenuEvents.onStartGame);
    });
  }
  _showGameOptions() {
    this.menuScene.addMenu(new CommonMenus.GameOptions(this.menuScene));
  }

  menuEnter(isBackNavigation) {
    this.layoutRows(this.rows, isBackNavigation);
  }
  layoutRows(rows, isBackNavigation) {
    const logo = rows[0];
    const playButton = rows[1];
    const optionsButton = rows[2];

    const middle = this.menuScene.gfx.getHudPoint("middle");

    const logoTop = middle.y - logo.visibleHeight / 2;
    logo.moveTo(middle.x - logo.visibleWidth / 2, logoTop + logo.visibleHeight * 0.3);
    logo.showLogo().easeOut().move(logo, { x: logo.x, y: logoTop });

    const buttonsTop = logoTop + logo.visibleHeight;
    const buttonDist = (playButton.visibleWidth / 2) * 1.05;
    playButton.moveTo(middle.x - buttonDist, buttonsTop);
    optionsButton.moveTo(middle.x + buttonDist, buttonsTop);

    this.flyInRows([playButton, optionsButton], false, 1);
  }

  menuLeave(isBackNavigation) {
    if (isBackNavigation) {
      const rows = this.rows;
      const logo = rows[0];
      const playButton = rows[1];
      const optionsButton = rows[2];

      this.flyOutRows([playButton, optionsButton], isBackNavigation);

      const logoTop = logo.y + logo.visibleHeight * 1.2;
      return logo.hideLogo().easeIn().move(logo, { x: logo.x, y: logoTop });
    } else {
      this.flyOutRows(this.rows, isBackNavigation);
    }
  }
}
