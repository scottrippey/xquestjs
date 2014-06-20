(function init_StartMenu() {
	var StartMenuEvents = {
		onStartArcadeGame: 'StartArcadeGame'
	};

	XQuestGame.StartMenu = Smart.Class(new XQuestGame.BaseScene(), {
		initialize: function (gfx) {
			this.BaseScene_initialize();

			this.gfx = gfx;
			this.addSceneItem(this.gfx);

			this._setupStartMenu();
		}
		,_setupStartMenu: function() {
			var startButton = this.gfx.createButton("Start Game", this._onStartArcadeGame.bind(this));
		}
		,_onStartArcadeGame: function() {
			this.fireSceneEvent(StartMenuEvents.onStartArcadeGame);
		}
	});
	XQuestGame.StartMenu.prototype.implementSceneEvents(StartMenuEvents);
})();