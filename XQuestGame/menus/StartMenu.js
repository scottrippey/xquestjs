(function init_StartMenu() {
	var StartMenuEvents = {
		onStartArcadeGame: 'StartArcadeGame'
	};

	XQuestGame.StartMenu = Smart.Class(new XQuestGame.BaseMenu(), {
		initialize: function (gfx) {
			this.BaseMenu_initialize(gfx);
			this._loadStartMenu();
		}
		,_loadStartMenu: function() {
			var startButton = this.gfx.createButton("Start Game", this._startArcadeGame.bind(this));
			var gameOptions = this.gfx.createButton("Game Options", this._loadGameOptions.bind(this));
			
			this.loadButtons([startButton, gameOptions]);
		}
		,_startArcadeGame: function() {
			this._leaveButtons(this.buttonStack.pop()).queue(function() {
				this.fireSceneEvent(StartMenuEvents.onStartArcadeGame);
			}.bind(this));
		}
		
		,_loadGameOptions: function() {
			var option1 = this.gfx.createButton("Option 1", this.goBack.bind(this));
			var option2 = this.gfx.createButton("Option 2", this.goBack.bind(this));
			var option3 = this.gfx.createButton("Option 3", this.goBack.bind(this));
			
			this.loadButtons([option1, option2, option3]);
		}
	});
	XQuestGame.StartMenu.prototype.implementSceneEvents(StartMenuEvents);
})();