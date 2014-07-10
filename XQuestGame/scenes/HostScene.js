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
		, createMenuScene: function() {
			var gfx = this.gfx.createNewGraphics();
			var menuScene = new XQuestGame.MenuScene(gfx, this.host);
			this.fireSceneEvent(HostSceneEvents.onMenuCreated, [ menuScene ]);
			
			return menuScene;
		}
	});

})();
