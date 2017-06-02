(function init_CommonMenus() {
	var MenuEvents = XQuestGame.MenuEvents;

	XQuestGame.CommonMenus = {
		PauseMenu: Smart.Class(new XQuestGame.BaseMenu(), {
			initialize(menuScene) {
				this.BaseMenu_initialize(menuScene);

				var pauseOverlay = this.menuScene.gfx.createPauseOverlay();
				pauseOverlay.showPauseOverlay();
			}
			,getRows() {
				return [
					this.createMenuButton("Resume Game", this._onResumeGame.bind(this))
					,this.createMenuButton("Game Options", this._showGameOptions.bind(this))
				];
			}
			,_onResumeGame() {
				this.menuScene.exitMenu().queue(function() {
					this.menuScene.fireSceneEvent(MenuEvents.onResumeGame);
				}.bind(this));
			}
			,_showGameOptions() {
				this.menuScene.addMenu(new XQuestGame.CommonMenus.GameOptions(this.menuScene));
			}
		})
		,
		GameOptions: Smart.Class(new XQuestGame.BaseMenu(), {
			getRows() {
				return [
					this.createMenuButton("Input Settings", this._showInputSettings.bind(this))
					,this.createMenuButton("Difficulty", this._showDifficultyMenu.bind(this))
					,this.createMenuButton("Graphics Test", this._showGraphicsTest.bind(this))
					,this.createMenuButton("Quit XQuest", this._showQuitConfirm.bind(this))
					,this.createMenuButton("Back", this.menuScene.goBack.bind(this.menuScene))
				];
			}
			,_showInputSettings() {
				this.menuScene.addMenu(new XQuestGame.CommonMenus.InputSettings(this.menuScene));
			}
			,_showGraphicsTest() {
				this.menuScene.addMenu(new XQuestGame.CommonMenus.GraphicsTestMenu(this.menuScene));
			}
			, _showDifficultyMenu() {
				this.menuScene.addMenu(new XQuestGame.CommonMenus.DifficultySettings(this.menuScene));
			}
			, _showQuitConfirm() {
				this.menuScene.addMenu(new XQuestGame.CommonMenus.ConfirmQuitGame(this.menuScene))
			}
		})
		,
		InputSettings: Smart.Class(new XQuestGame.BaseMenu(), {
			getRows() {
				return [
					this.createMenuButton("Mouse", this._showMouseSensitivity.bind(this))
					,this.createMenuButton("Keyboard", this._showKeyboardSensitivity.bind(this))
					,this.createMenuButton("Touch", this._showTouchSensitivity.bind(this))
					,this.createMenuButton("Back", this.menuScene.goBack.bind(this.menuScene))
				];
			}
			, _showMouseSensitivity() {
				this.menuScene.addMenu(new XQuestGame.CommonMenus.MouseSettings(this.menuScene));
			}
			, _showKeyboardSensitivity() {
				this.menuScene.addMenu(new XQuestGame.CommonMenus.KeyboardSettings(this.menuScene));
			}
			, _showTouchSensitivity() {
				this.menuScene.addMenu(new XQuestGame.CommonMenus.TouchSettings(this.menuScene));
			}
		})
		,
		DifficultySettings: Smart.Class(new XQuestGame.BaseMenu(), {
			getRows() {
				return [
					this.createMenuButton("Easy", function() { Balance.setGameMode('easy'); this.menuScene.goBack(); }.bind(this))
					,this.createMenuButton("Normal", function() { Balance.setGameMode('normal'); this.menuScene.goBack(); }.bind(this))
					,this.createMenuButton("Crazy Hard", function() { Balance.setGameMode('hard'); this.menuScene.goBack(); }.bind(this))
				];
			}
		})
		,
		MouseSettings: Smart.Class(new XQuestGame.BaseMenu(), {
			onMenuLeave() {
				this.menuScene.host.settings.saveSetting('mouseSettings', this.mouseSettings);
			},
			getRows() {
				var mouseSettings = this.mouseSettings = this.menuScene.host.settings.retrieveSetting('mouseSettings');

				var sensitivity = this.createMenuButton(function() {
					return "Sensitivity: " + mouseSettings.mouseSensitivity;
				}, function() {
					mouseSettings.mouseSensitivity = (mouseSettings.mouseSensitivity % mouseSettings.maxMouseSensitivity) + 1;
					sensitivity.updateText();
				});
				var bias = this.createMenuButton(function(){
					return "Edge Sensitivity: " + mouseSettings.mouseBiasSensitivity;
				}, function() {
					mouseSettings.mouseBiasSensitivity = (mouseSettings.mouseBiasSensitivity % mouseSettings.maxMouseBias) + 1;
					bias.updateText();
				});
				var reset = this.createMenuButton("Reset", function() {
					mouseSettings = this.mouseSettings = this.menuScene.host.settings.saveSetting('mouseSettings', null);
					rows.forEach(function(row) { row.updateText && row.updateText(); });
				}.bind(this));


				var rows = [
					sensitivity
					,bias
					,reset
					,this.createMenuButton("Back", this.menuScene.goBack.bind(this.menuScene))
				];
				return rows;
			}
		})
		,
		KeyboardSettings: Smart.Class(new XQuestGame.BaseMenu(), {
			onMenuLeave() {
				this.menuScene.host.settings.saveSetting('keyboardSettings', this.keyboardSettings);
			},
			getRows() {
				var keyboardSettings = this.keyboardSettings = this.menuScene.host.settings.retrieveSetting('keyboardSettings');

				var sensitivity = this.createMenuButton(function() {
					return "Sensitivity: " + keyboardSettings.keyboardSensitivity;
				}, function() {
					keyboardSettings.keyboardSensitivity = (keyboardSettings.keyboardSensitivity % keyboardSettings.maxKeyboardSensitivity) + 1;
					sensitivity.updateText();
				});
				var reset = this.createMenuButton("Reset", function() {
					keyboardSettings = this.keyboardSettings = this.menuScene.host.settings.saveSetting('keyboardSettings', null);
					rows.forEach(function(row) { row.updateText && row.updateText(); });
				}.bind(this));


				var rows = [
					sensitivity
					,reset
					,this.createMenuButton("Back", this.menuScene.goBack.bind(this.menuScene))
				];
				return rows;
			}
		})
		,
		TouchSettings: Smart.Class(new XQuestGame.BaseMenu(), {
			onMenuLeave() {
				this.menuScene.host.settings.saveSetting('touchSettings', this.touchSettings);
			},
			getRows() {
				var touchSettings = this.touchSettings = this.menuScene.host.settings.retrieveSetting('touchSettings');

				var sensitivity = this.createMenuButton(function() {
					return "Sensitivity: " + touchSettings.touchSensitivity;
				}, function() {
					touchSettings.touchSensitivity = (touchSettings.touchSensitivity % touchSettings.maxTouchSensitivity) + 1;
					sensitivity.updateText();
				});
				var reset = this.createMenuButton("Reset", function() {
					touchSettings = this.touchSettings = this.menuScene.host.settings.saveSetting('touchSettings', null);
					rows.forEach(function(row) { row.updateText && row.updateText(); });
				}.bind(this));


				var rows = [
					sensitivity
					,reset
					,this.createMenuButton("Back", this.menuScene.goBack.bind(this.menuScene))
				];
				return rows;
			}
		})
		,
		ConfirmQuitGame: Smart.Class(new XQuestGame.BaseMenu(), {
			getRows() {
				var rows = [
					this.createMenuButton("Quit XQuest", this.menuScene.host.quitGame.bind(this.menuScene.host))
					,this.createMenuButton("Back", this.menuScene.goBack.bind(this.menuScene))
				];
				return rows;
			}
		})

	};
})();
