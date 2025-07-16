import { Class } from "@/Common/src/Smart/Smart.Class.js";

XQuestGame.CommonMenus.GraphicsTestMenu = Class(new XQuestGame.BaseMenu(), {
  getRows() {
    const goBack = this.menuScene.goBack.bind(this.menuScene);
    const player = this.createMenuButton("Player", goBack);
    const objects = this.createMenuButton("Objects", goBack);
    const enemies = this.createMenuButton("Enemies", goBack);

    const halfButtonHeight = player.visibleHeight / 2;

    player
      .addChild(this.menuScene.gfx.createPlayerGraphics())
      .moveTo(-halfButtonHeight, halfButtonHeight);

    objects
      .addChild(this.menuScene.gfx.createCrystalGraphic())
      .moveTo(-halfButtonHeight * 3, halfButtonHeight);
    objects
      .addChild(this.menuScene.gfx.createPowerCrystalGraphic())
      .moveTo(-halfButtonHeight * 2, halfButtonHeight);
    objects
      .addChild(this.menuScene.gfx.createBombCrystalGraphic())
      .moveTo(-halfButtonHeight, halfButtonHeight);

    enemies
      .addChild(this.menuScene.gfx.createEnemyGraphics("Slug"))
      .moveTo(-halfButtonHeight * 3, halfButtonHeight);
    enemies
      .addChild(this.menuScene.gfx.createEnemyGraphics("Locust"))
      .moveTo(-halfButtonHeight * 2, halfButtonHeight);
    enemies
      .addChild(this.menuScene.gfx.createEnemyGraphics("Mantis"))
      .moveTo(-halfButtonHeight, halfButtonHeight);

    return [player, objects, enemies];
  },
});
