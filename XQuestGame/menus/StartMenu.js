(function() {
	var StartMenuEvents = {
		onStartGame: 'onStartGame'
	};

	XQuestGame.StartMenu = Smart.Class(new XQuestGame.BaseMenu().implementEvents(StartMenuEvents), {
		getRows: function() {
			var xQuestLogo = this._createLogo();
			return [
				xQuestLogo
				,this.createMenuButton("Play xQuest", this._startGame.bind(this))
				,this.createMenuButton("Game Options", this._showGameOptions.bind(this))
			];
		}
		, _createLogo: function() {
			var logo = this.menuScene.gfx.createXQuestLogoGraphic();

			logo.setActive = false; // Ensure it's not selectable

			this.logo = logo;
			return logo;
		}
		,_startGame: function() {
			this.menuScene.exitMenu().queue(function() {
				this.fireEvent(StartMenuEvents.onStartGame);
			}.bind(this));
		}
		,_showGameOptions: function() {
			this.menuScene.addMenu(new XQuestGame.CommonMenus.GameOptions(this.menuScene));
		}

		,menuEnter: function(isBackNavigation) {
			this.layoutRows(this.rows, isBackNavigation);
		}
		,layoutRows: function(rows, isBackNavigation) {
			var logo = rows[0], playButton = rows[1], optionsButton = rows[2];

			var middle = this.menuScene.gfx.getHudPoint('middle');

			var logoTop = middle.y - logo.visibleHeight / 2;
			logo.moveTo(middle.x - logo.visibleWidth / 2, logoTop + logo.visibleHeight * 0.3);
			logo.showLogo()
				.easeOut()
				.move(logo, { x: logo.x, y: logoTop });


			var buttonsTop = logoTop + logo.visibleHeight,
				buttonDist = playButton.visibleWidth / 2 * 1.05;
			playButton.moveTo(middle.x - buttonDist, buttonsTop);
			optionsButton.moveTo(middle.x + buttonDist, buttonsTop);

			this.flyInRows([ playButton, optionsButton ], false, 1);
		}

		,menuLeave: function(isBackNavigation) {
			if (isBackNavigation) {
				var rows = this.rows, logo = rows[0], playButton = rows[1], optionsButton = rows[2];

				this.flyOutRows([ playButton, optionsButton ], isBackNavigation);

				var logoTop = logo.y + logo.visibleHeight * 1.2;
				return logo.hideLogo()
					.easeIn()
					.move(logo, { x: logo.x, y: logoTop });
			} else {
				this.flyOutRows(this.rows, isBackNavigation);
			}
		}
	});

})();
	