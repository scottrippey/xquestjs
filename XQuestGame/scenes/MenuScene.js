(function init_MenuScene() {
	
	XQuestGame.MenuSceneInputs = {
		menuUp: 'menuUp',
		menuDown: 'menuDown',
		menuLeft: 'menuLeft',
		menuRight: 'menuRight',
		menuInvoke: 'menuInvoke',
		menuBack: 'menuBack'
	};

	var MenuSceneEvents = {
		onResumeGame: 'onResumeGame'
		, onStartGame: 'onStartGame'
	};
	
	XQuestGame.MenuScene = Smart.Class(new XQuestGame.BaseScene().implementSceneEvents(MenuSceneEvents), {
		initialize: function(gfx, host) {
			this.MenuScene_initialize(gfx, host);
		}
		,MenuScene_initialize: function (gfx, host) {
			this.BaseScene_initialize();

			this.gfx = gfx;
			this.host = host;
			this.menuScene = this; // For consistency
			this.addSceneItem(this);
			this.addSceneItem(this.gfx);

			this.menuStack = [];
		}
		
		,_setupBackButton: function() {
			var backButton = this.menuScene.gfx.createMenuButton("Back");
			backButton.addButtonEvents({
				invoke: this.goBack.bind(this)
			});
			var top = this.menuScene.gfx.getHudPoint('top');
			backButton.moveTo(top.x, top.y + backButton.visibleHeight);

			this.backButton = backButton;
			this.backButton.visible = false;
		}
		,_updateBackButton: function() {
			if (!this.backButton) return;
			
			this.backButton.visible = (this.menuStack.length >= 2);
		}
		
		,getDefaultInputState: function() {
			var state = {
				menuMode: true
			};
			return state;
		}
		
		,addMenu: function(menu) {
			if (this.currentMenu)
				this.currentMenu.menuLeave(false);
			
			this.menuStack.push(menu);
			this.currentMenu = menu;

			this._updateBackButton();
			this.currentMenu.menuEnter(false);
		}
		,goBack: function() {
			if (this.menuStack.length <= 1) return;
			
			this.menuStack.pop().menuLeave(true);
			
			this.currentMenu = this.menuStack[this.menuStack.length - 1];
			this.currentMenu.menuEnter(true);
			
			this._updateBackButton();
		}
		,exitMenu: function() {
			this.menuStack.length = 0;
			return this.currentMenu.menuLeave(true);
		}

		,onMove: function(tickEvent, inputState) {
			this.currentMenu.menuInput(inputState);
			
			if (inputState.menuBack && this.menuStack.length >= 2) {
				this.goBack();
			}
		}
		
		,showStartMenu: function() {
			var startMenu = new XQuestGame.StartMenu(this.menuScene);
			startMenu.onStartGame(function() {
				this.fireSceneEvent(MenuSceneEvents.onStartGame);
			}.bind(this));
			
			this.addMenu(startMenu);
		}
		,showPauseMenu: function() {
			var pauseMenu = new XQuestGame.CommonMenus.PauseMenu(this.menuScene);
			pauseMenu.onResumeGame(function() {
				this.fireSceneEvent(MenuSceneEvents.onResumeGame);
			}.bind(this));
			
			this.addMenu(pauseMenu);
		}

	});
})();
	