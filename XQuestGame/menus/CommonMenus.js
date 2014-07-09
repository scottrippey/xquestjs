(function init_CommonMenus() {
	var StartMenuEvents = { onStartGame: 'onStartGame' };
	var PauseMenuEvents = { onResumeGame: 'onResumeGame' };
	
	XQuestGame.CommonMenus = {
		StartMenu: Smart.Class(new XQuestGame.BaseMenu().implementEvents(StartMenuEvents), {
			getRows: function() {
				return [
					this.createMenuButton("Start Game", this._onStartGame.bind(this))
					,this.createMenuButton("Game Options", this._showGameOptions.bind(this))
					,this.createMenuButton("Graphics Test", this._showGraphicsTest.bind(this))
				];
			}
			,_onStartGame: function() {
				this.menuScene.exitMenu(function() {
					this.fireEvent(StartMenuEvents.onStartGame);
				}.bind(this));
			}
			,_showGameOptions: function() {
				this.menuScene.addMenu(new XQuestGame.CommonMenus.GameOptions(this.menuScene));
			}
			,_showGraphicsTest: function() {
				this.menuScene.addMenu(new XQuestGame.CommonMenus.GraphicsTestMenu(this.menuScene));
			}
		})
		,
		PauseMenu: Smart.Class(new XQuestGame.BaseMenu().implementEvents(PauseMenuEvents), {
			getRows: function() {
				return [
					this.createMenuButton("Resume Game", this._onResumeGame.bind(this))
				];
			}
			,
			_onResumeGame: function() {
				this.menuScene.exitMenu(function() {
					this.fireEvent(PauseMenuEvents.onResumeGame);
				}.bind(this));
			}
		})
		,
		GameOptions: Smart.Class(new XQuestGame.BaseMenu(), {
			getRows: function() {
				return [
					this.createMenuButton("Difficulty", this._showDifficultyMenu.bind(this))
//					,this.createMenuButton("Mouse Settings", function() {})
//					,this.createMenuButton("Keyboard Settings", function() {})
					,this.createMenuButton("Back", this.menuScene.goBack.bind(this.menuScene))
				];
			}
			, _showDifficultyMenu: function() {
				this.menuScene.addMenu(new XQuestGame.CommonMenus.DifficultySettings(this.menuScene));
			}
		})
		,
		DifficultySettings: Smart.Class(new XQuestGame.BaseMenu(), {
			getRows: function() {
				return [
					this.createMenuButton("Easy", function() { Balance.setGameMode('easy'); this.menuScene.goBack(); }.bind(this))
					,this.createMenuButton("Normal", function() { Balance.setGameMode('normal'); this.menuScene.goBack(); }.bind(this))
					,this.createMenuButton("Crazy Hard", function() { Balance.setGameMode('hard'); this.menuScene.goBack(); }.bind(this))
				];
			}
		})
	};
})();
	