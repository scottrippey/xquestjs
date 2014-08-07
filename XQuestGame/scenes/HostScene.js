(function() {
	var HostSceneEvents = {
		onMenuCreated: 'onMenuCreated'
		, onGameCreated: 'onGameCreated'
		, onQuitGame: 'onQuitGame'
	};

	XQuestGame.HostScene = Smart.Class(new XQuestGame.BaseScene().implementSceneEvents(HostSceneEvents), {
		initialize: function(gfx, settings) {
			this.BaseScene_initialize();

			this.gfx = gfx;
			this.addSceneItem(gfx);
			this.settings = settings;
			
			this.host = this; // For consistency

			this._setupBackground();

		}
		, _setupBackground: function() {
			this.gfx.showBackgroundStars(true);
			
			var middle = this.gfx.getGamePoint('middle');
			this.gfx.followPlayer(middle);
		}
		, start: function() {
			this._showStartMenu();
		}
		, _showStartMenu: function() {
			var menuScene = this.createMenuScene();

			this.setChildScene(menuScene);

			menuScene.onStartGame(function() {
				menuScene.dispose();
				this._startArcadeGame();
			}.bind(this));
			menuScene.showStartMenu();
		}
		, createMenuScene: function() {
			var gfx = this.gfx.createNewGraphics();
			var menuScene = new XQuestGame.MenuScene(gfx, this.host);
			this.fireSceneEvent(HostSceneEvents.onMenuCreated, [ menuScene ]);

			return menuScene;
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
			
			arcadeGame.startArcadeGame();
		}
		, quitGame: function() {
			this.fireSceneEvent(HostSceneEvents.onQuitGame);
		}
	});

})();
