(() => {
	var HostSceneEvents = {
		onMenuCreated: 'onMenuCreated',
		onGameCreated: 'onGameCreated',
		onQuitGame: 'onQuitGame'
	};

	XQuestGame.HostScene = Smart.Class(new XQuestGame.BaseScene().implementSceneEvents(HostSceneEvents), {
		initialize(gfx, settings) {
			this.BaseScene_initialize();

			this.gfx = gfx;
			this.addSceneItem(gfx);
			this.settings = settings;

			this.host = this; // For consistency

			this._setupBackground();

		},
		_setupBackground() {
			this.gfx.showBackgroundStars(true);

			var middle = this.gfx.getGamePoint('middle');
			this.gfx.followPlayer(middle);
		},
		start() {
			this._showStartMenu();
		},
		_showStartMenu() {
			var menuScene = this.createMenuScene();

			this.setChildScene(menuScene);

			menuScene.onStartGame(() => {
				menuScene.dispose();
				this._startArcadeGame();
			});
			menuScene.showStartMenu();
		},
		createMenuScene() {
			var gfx = this.gfx.createNewGraphics();
			var menuScene = new XQuestGame.MenuScene(gfx, this.host);
			this.fireSceneEvent(HostSceneEvents.onMenuCreated, [ menuScene ]);

			return menuScene;
		},
		_startArcadeGame() {
			var gfx = this.gfx.createNewGraphics();
			var arcadeGame = new XQuestGame.ArcadeGame(gfx, this.host);
			this.fireSceneEvent(HostSceneEvents.onGameCreated, [ arcadeGame ]);
			this.setChildScene(arcadeGame);

			arcadeGame.onGameOver(() => {
				arcadeGame.dispose();
				this._showStartMenu();
			});

			arcadeGame.startArcadeGame();
		},
		quitGame() {
			this.fireSceneEvent(HostSceneEvents.onQuitGame);
		}
	});

})();
