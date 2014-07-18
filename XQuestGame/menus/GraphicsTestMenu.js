XQuestGame.CommonMenus.GraphicsTestMenu = Smart.Class(new XQuestGame.BaseMenu(), {
	getRows: function() {
		var goBack = this.menuScene.goBack.bind(this.menuScene);
		var player = this.createMenuButton("Player", goBack),
			objects = this.createMenuButton("Objects", goBack),
			enemies = this.createMenuButton("Enemies", goBack);
		
		var halfButtonHeight = player.visibleHeight / 2;
		
		player.addChild(this.menuScene.gfx.createPlayerGraphics()).moveTo(-halfButtonHeight, halfButtonHeight);
		
		objects.addChild(this.menuScene.gfx.createCrystalGraphic()).moveTo(-halfButtonHeight * 3, halfButtonHeight);
		objects.addChild(this.menuScene.gfx.createPowerCrystalGraphic()).moveTo(-halfButtonHeight * 2, halfButtonHeight);
		objects.addChild(this.menuScene.gfx.createBombCrystalGraphic()).moveTo(-halfButtonHeight, halfButtonHeight);
		
		enemies.addChild(this.menuScene.gfx.createEnemyGraphics("Slug")).moveTo(-halfButtonHeight * 4, halfButtonHeight);
		enemies.addChild(this.menuScene.gfx.createEnemyGraphics("Locust")).moveTo(-halfButtonHeight * 3, halfButtonHeight);
		enemies.addChild(this.menuScene.gfx.createEnemyGraphics("Mantis")).moveTo(-halfButtonHeight * 2, halfButtonHeight);
		enemies.addChild(this.menuScene.gfx.createEnemyGraphics("Roach")).moveTo(-halfButtonHeight * 1, halfButtonHeight);
		
		return [
			player
			,objects
			,enemies
		];
	}
});