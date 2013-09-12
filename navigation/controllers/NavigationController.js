angular.module('XQuestUI').controller('NavigationController', [
	function() {
		_.extend(this, {
			page: null
			, pages: {
				main: 'navigation/templates/main.html'
				, arcadeGame: 'XQuestUI/Angular/templates/ArcadeGame.html'
			}
			, initialize: function() {
				this.goHome();
			}
			,
			startArcadeGame: function() {
				this.page = this.pages.arcadeGame;
			}
			,
			goHome: function() {
				this.page = this.pages.main;
			}
		});

		this.initialize();
	}
]);
