XQuestGame.CommonMenus.GraphicsTestMenu = Smart.Class(new XQuestGame.BaseMenu(), {
	getRows() {
		var goBack = this.menuScene.goBack.bind(this.menuScene);
		var player = this.createMenuButton("Player", goBack);
		var objects = this.createMenuButton("Objects", goBack);
		var enemies = this.createMenuButton("Enemies", goBack);

		var halfButtonHeight = player.visibleHeight / 2;

		player.addChild(this.menuScene.gfx.createPlayerGraphics()).moveTo(-halfButtonHeight, halfButtonHeight);

		objects.addChild(this.menuScene.gfx.createCrystalGraphic()).moveTo(-halfButtonHeight * 3, halfButtonHeight);
		objects.addChild(this.menuScene.gfx.createPowerCrystalGraphic()).moveTo(-halfButtonHeight * 2, halfButtonHeight);
		objects.addChild(this.menuScene.gfx.createBombCrystalGraphic()).moveTo(-halfButtonHeight, halfButtonHeight);

		enemies.addChild(this.menuScene.gfx.createEnemyGraphics("Slug")).moveTo(-halfButtonHeight * 3, halfButtonHeight);
		enemies.addChild(this.menuScene.gfx.createEnemyGraphics("Locust")).moveTo(-halfButtonHeight * 2, halfButtonHeight);
		enemies.addChild(this.menuScene.gfx.createEnemyGraphics("Mantis")).moveTo(-halfButtonHeight, halfButtonHeight);

		return [
			player,
			objects,
			enemies
		];
	}
});
