export class Hud {
  constructor(game) {
    this.game = game;
    this._setupGraphics();
    this._layout();

    this.game.onNewLevel(this._onNewLevel.bind(this));
  }
  _setupGraphics() {
    this.game.gfx.enableTouchClicks();

    this.hudOverlay = this.game.gfx.createHUDOverlay();

    this.hudLivesIcon = this.game.gfx.createPlayerHUDIcon();
    this.hudLivesText = this.game.gfx.addText("", "hudText");

    this.hudCrystalsIcon = this.game.gfx.createCrystalHUDIcon();
    this.hudCrystalsText = this.game.gfx.addText("", "hudText");

    this.hudBombsIcon = this.game.gfx.createBombCrystalHUDIcon();
    this.hudBombsText = this.game.gfx.addText("", "hudText");

    this.hudPauseButton = this.game.gfx.createPauseButtonHUD();
    this.hudPauseButton.addEventListener("click", () => {
      this.game.pauseGame();
    });
  }
  _layout() {
    const bounds = Balance.level.bounds;
    const middle = bounds.hudHeight / 2;
    const spacer = 50;

    let leftPos = spacer;

    leftPos += this.hudLivesIcon.visibleRadius;
    this.hudLivesIcon.moveTo(leftPos, middle);
    leftPos += this.hudLivesIcon.visibleRadius;
    this.hudLivesText.moveTo(leftPos, middle);

    leftPos += spacer;

    leftPos += this.hudBombsIcon.visibleRadius;
    this.hudBombsIcon.moveTo(leftPos, middle);
    leftPos += this.hudBombsIcon.visibleRadius;
    this.hudBombsText.moveTo(leftPos, middle);

    leftPos += spacer;

    leftPos += this.hudCrystalsIcon.visibleRadius;
    this.hudCrystalsIcon.moveTo(leftPos, middle);
    leftPos += this.hudCrystalsIcon.visibleRadius;
    this.hudCrystalsText.moveTo(leftPos, middle);

    leftPos += spacer;

    const center = bounds.visibleWidth / 2;
    this.hudPauseButton.moveTo(
      center - this.hudPauseButton.width / 2,
      middle - this.hudPauseButton.height / 2,
    );
  }
  onAct(tickEvent) {
    this.hudLivesText.text = ` x ${this.game.stats.lives}`;
    this.hudCrystalsText.text = ` x ${this.game.stats.crystalCount}`;
    this.hudBombsText.text = ` x ${this.game.stats.bombs}`;
  }

  _onNewLevel() {
    const levelConfig = this.game.levelConfig;

    const faded = 0.3;

    this.hudLivesIcon.alpha = this.hudLivesText.alpha = levelConfig.skipLevelOnPlayerDeath
      ? faded
      : 1;
    this.hudCrystalsIcon.alpha = this.hudCrystalsText.alpha = levelConfig.crystalsDisabled
      ? faded
      : 1;
    this.hudBombsIcon.alpha = this.hudBombsText.alpha = levelConfig.bombsDisabled ? faded : 1;
  }
}
