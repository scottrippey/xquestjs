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
		,_stackButtons: function(buttons_) {
			var buttons = arguments;

			var margin = 20;
			var middle = this.gfx.getHudPoint('middle');

			var buttonHeight = buttons[0].visibleHeight;
			var stackedButtonsHeight = buttons.length * (buttonHeight + margin) - margin;
			var currentTop = middle.y - stackedButtonsHeight / 2;

			for (var i = 0, l = buttons.length; i < l; i++) {
				var button = buttons[i];
				button.moveTo(middle.x - button.visibleWidth / 2, currentTop);
				currentTop += button.visibleHeight + margin;
			}
		}

		,_setupStartMenu: function() {
			var startButton = this.gfx.createButton("Start Game", this._onStartArcadeGame.bind(this));

			this._stackButtons(startButton);
		}

		,_onStartArcadeGame: function() {
			this.fireSceneEvent(StartMenuEvents.onStartArcadeGame);
		}
	});
	XQuestGame.StartMenu.prototype.implementSceneEvents(StartMenuEvents);
})();