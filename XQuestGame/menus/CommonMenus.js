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
				this.menuScene.exitMenu().queue(function() {
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
					,this.createMenuButton("Game Options", this._showGameOptions.bind(this))
				];
			}
			,_onResumeGame: function() {
				this.menuScene.exitMenu().queue(function() {
					this.fireEvent(PauseMenuEvents.onResumeGame);
				}.bind(this));
			}
			,_showGameOptions: function() {
				this.menuScene.addMenu(new XQuestGame.CommonMenus.GameOptions(this.menuScene));
			}
		})
		,
		GameOptions: Smart.Class(new XQuestGame.BaseMenu(), {
			getRows: function() {
				return [
					this.createMenuButton("Mouse", this._showMouseSensitivity.bind(this))
					,this.createMenuButton("Keyboard", this._showKeyboardSensitivity.bind(this))
					,this.createMenuButton("Touch", this._showTouchSensitivity.bind(this))
					,this.createMenuButton("Difficulty", this._showDifficultyMenu.bind(this))
					,this.createMenuButton("Back", this.menuScene.goBack.bind(this.menuScene))
				];
			}
			, _showMouseSensitivity: function() {
				this.menuScene.addMenu(new XQuestGame.CommonMenus.MouseSettings(this.menuScene));
			}
			, _showKeyboardSensitivity: function() {
				this.menuScene.addMenu(new XQuestGame.CommonMenus.KeyboardSettings(this.menuScene));
			}
			, _showTouchSensitivity: function() {
				this.menuScene.addMenu(new XQuestGame.CommonMenus.TouchSettings(this.menuScene));
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
		,
		MouseSettings: Smart.Class(new XQuestGame.BaseMenu(), {
			onMenuLeave: function() {
				this.menuScene.host.settings.saveSetting('mouseSettings', this.mouseSettings);
			},
			getRows: function() {
				var mouseSettings = this.mouseSettings = this.menuScene.host.settings.retrieveSetting('mouseSettings');
				
				var rows = [
					this.createMenuButton(function() { 
							return "Sensitivity: " + mouseSettings.mouseSensitivity;
						}, function() {
							mouseSettings.mouseSensitivity = (mouseSettings.mouseSensitivity % mouseSettings.maxMouseSensitivity) + 1;
							this.updateText();
						})
					,this.createMenuButton(function(){
							return "Center Bias: " + mouseSettings.mouseBiasSensitivity;
						}, function() {
							mouseSettings.mouseBiasSensitivity = (mouseSettings.mouseBiasSensitivity % mouseSettings.maxMouseBias) + 1;
							this.updateText();
						})
					,this.createMenuButton("Reset", function() {
						mouseSettings = this.mouseSettings = this.menuScene.host.settings.saveSetting('mouseSettings', null);
						rows.forEach(function(row) { row.updateText && row.updateText(); });
					}.bind(this))
					,this.createMenuButton("Back", this.menuScene.goBack.bind(this.menuScene))
				];
				return rows;
			}
		})
		
	};
})();
	