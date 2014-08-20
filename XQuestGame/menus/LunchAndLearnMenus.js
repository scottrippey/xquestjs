(function init_LnLMenus() {
	var LnLMenu = Smart.Class(new XQuestGame.BaseMenu(), {
		_loadMenu: function(menuName) {
			return function() {
				var menuCtor = XQuestGame.LunchAndLearnMenus[menuName];
				this.menuScene.addMenu(new menuCtor(this.menuScene));
			}.bind(this);
		}
		,_goBack: function() {
			return this.menuScene.goBack.bind(this.menuScene);
		}
	});
	XQuestGame.LunchAndLearnMenus = {
		MainMenu: Smart.Class(new LnLMenu(), {
			getRows: function() {
				return [
					this.createMenuButton("The Game Loop", this._loadMenu('GameLoop'))
					,this.createMenuButton("Back", this._goBack())
				];
			}
		})
		,
		'GameLoop': Smart.Class(new LnLMenu(), {
			getRows: function() {
				return [
					this.createMenuButton("Input", this._goBack())
					,this.createMenuButton("Move", this._goBack())
				];
			}
		})
	};
})();