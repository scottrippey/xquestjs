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
			var startButton = this.createMenuButton("Start Game", this._startArcadeGame.bind(this));
			//var gameOptions = this.createMenuButton("Game Options", this._loadGameOptions.bind(this));
			
			this.loadMenuButtons([ startButton ]);
		}
		,_startArcadeGame: function() {
			this.exitMenu(function() {
				this.fireSceneEvent(StartMenuEvents.onStartArcadeGame);
			}.bind(this));
		}
		
		,_loadGameOptions: function() {
			var testGraphics = this.createMenuButton("Test Graphics", this._startTestGraphics.bind(this));
			var back = this.createMenuButton("Back", this.goBack.bind(this));
			this.loadMenuButtons([ testGraphics, back ]);
		}
		,_startTestGraphics: function() {
			var player = this._createMenuButtonWithIcon("Player", this.gfx.createPlayerGraphics(), null);
			var enemies = this._createMenuButtonWithIcon("Enemies", this.gfx.createEnemyGraphics("Locust"), null);
			var items = this._createMenuButtonWithIcon("Items", this.gfx.createCrystalGraphic(), null);
			var back = this.createMenuButton("Back", this.goBack.bind(this));

			this.loadMenuButtons([ player, enemies, items, back ]);
		}
		,_createMenuButtonWithIcon: function(text, icon, callback) {
			var button = this.createMenuButton(text, callback || function(){ icon.scaleX *= 1.2; icon.scaleY *= 1.2; });
			button.addChild(icon);
			icon.moveTo(-icon.visibleRadius * 2, button.visibleHeight / 2);
			return button;
		}
	});
	XQuestGame.StartMenu.prototype.implementSceneEvents(StartMenuEvents);
})();