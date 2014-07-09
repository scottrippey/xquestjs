(function init_MenuScene() {
	var MenuSceneEvents = {
		onMenuExit: 'MenuExit'
	};
	
	XQuestGame.MenuSceneInputs = {
		menuUp: 'menuUp',
		menuDown: 'menuDown',
		menuLeft: 'menuLeft',
		menuRight: 'menuRight',
		menuInvoke: 'menuInvoke',
		menuBack: 'menuBack'
	};
	
	XQuestGame.MenuScene = Smart.Class(new XQuestGame.BaseScene(), {
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
			
			var middle = this.gfx.getGamePoint('middle');
			this.gfx.followPlayer(middle);
			//this._setupBackButton(); // Too ugly for now
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
		
		,addMenu: function(menu) {
			if (this.currentMenu)
				this.currentMenu.menuLeave(false);
			
			this.menuStack.push(menu);
			this.currentMenu = menu;

			this._updateBackButton();
			this.currentMenu.menuEnter(false);
			this.scenePaused = false;
		}
		,goBack: function() {
			if (this.menuStack.length <= 1) return;
			
			this.menuStack.pop().menuLeave(true);
			
			this.currentMenu = this.menuStack[this.menuStack.length - 1];
			this.currentMenu.menuEnter(true);
			
			this._updateBackButton();
		}
		,exitMenu: function(callback) {
			this.menuStack.length = 0;
			this.currentMenu.menuLeave(true).queue(function() {
				this.fireSceneEvent(MenuSceneEvents.onMenuExit);
				callback();
				this.dispose();
				this.scenePaused = true;
			}.bind(this));
		}

		,onMove: function(tickEvent, inputState) {
			this.currentMenu.menuInput(inputState);
			
			if (inputState.menuBack && this.menuStack.length >= 2) {
				this.goBack();
			}
		}

	});
	
	XQuestGame.MenuScene.prototype.implementSceneEvents(MenuSceneEvents);
})();
	