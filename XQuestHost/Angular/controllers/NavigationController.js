angular.module('XQuestHost').controller('NavigationController', [
	function NavigationController() {
		_.extend(this, {
			page: null
			,
			pages: {
				main: 'XQuestHost/Angular/templates/help/help.html'
				, arcadeGame: 'XQuestHost/Angular/templates/ArcadeGame.html'
				, testGraphics: 'XQuestHost/Angular/templates/test/TestGraphics.html'
			}
			,
			initialize: function() {
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
			,
			showTestGraphics: function() {
				this.page = this.pages.testGraphics;
			}
		});

		this.initialize();
	}
]);
