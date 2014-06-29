(function init_PauseMenu() {
	var PauseMenuEvents = {
		onResumeGame: 'ResumeGame'
	};

	XQuestGame.PauseMenu = Smart.Class(new XQuestGame.BaseMenu(), {
		initialize: function (gfx) {
			this.BaseMenu_initialize(gfx);
			this._loadPauseMenu();
		}
		,_loadPauseMenu: function() {
			var resumeButton = this.createMenuButton("Resume Game", this._resumeGame.bind(this));
			//var gameOptions = this.createMenuButton("Game Options", this._loadGameOptions.bind(this));
			
			this.loadMenuButtons([ resumeButton ]);
		}
		,_resumeGame: function() {
			this.exitMenu(function() {
				this.fireSceneEvent(PauseMenuEvents.onResumeGame);
			}.bind(this));
		}
		
		,_loadGameOptions: function() {
			var option1 = this.createMenuButton("Option 1", this.goBack.bind(this));
			var option2 = this.createMenuButton("Option 2", this.goBack.bind(this));
			var option3 = this.createMenuButton("Option 3", this.goBack.bind(this));
			
			this.loadMenuButtons([option1, option2, option3]);
		}
	});
	XQuestGame.PauseMenu.prototype.implementSceneEvents(PauseMenuEvents);
})();