(function() {
	var HostSceneEvents = {
		onMenuCreated: 'onMenuCreated'
		, onGameCreated: 'onGameCreated'
	};

	XQuestGame.HostScene = Smart.Class(new XQuestGame.BaseScene().implementSceneEvents(HostSceneEvents), {
		initialize: function(gfx) {
			this.HostScene_initialize(gfx);
		}
		, HostScene_initialize: function(gfx) {
			this.BaseScene_initialize();

			this.host = this; // For consistency
			this.host.gfx = gfx;
			this.addSceneItem(gfx);

			this._setupBackground();

			this._showStartMenu();
		}
		, _setupBackground: function() {
			this.gfx.showBackgroundStars(true);
		}
		, _showStartMenu: function() {
			var gfx = this.gfx.createNewGraphics();
			var menuScene = new XQuestGame.MenuScene(gfx, this.host);
			this.fireSceneEvent(HostSceneEvents.onMenuCreated, [ menuScene ]);
			this.setChildScene(menuScene);

			var startMenu = new XQuestGame.CommonMenus.StartMenu(menuScene);
			menuScene.addMenu(startMenu);
			startMenu.onStartGame(function() {
				menuScene.dispose();
				this._startArcadeGame();
			}.bind(this));
		}
		, _startArcadeGame: function() {
			var gfx = this.gfx.createNewGraphics();
			var arcadeGame = new XQuestGame.ArcadeGame(gfx, this.host);
			this.fireSceneEvent(HostSceneEvents.onGameCreated, [ arcadeGame ]);
			this.setChildScene(arcadeGame);

			arcadeGame.onGameOver(function() {
				arcadeGame.dispose();
				this._showStartMenu();
			}.bind(this));
		}
	});

})();
