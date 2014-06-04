angular.module("XQuestHost").controller("XQuestUIController", [
	'UserSettings', '$scope', '$window', '$document', function XQuestUIController(UserSettings, $scope, $window, $document) {
		$scope.Balance = Balance;
		$scope.UserSettings = UserSettings;
		_.extend(this, {
			currentGame: null
			, engaged: false
			, hud: null
			, hudPages: {
				paused: 'XQuestHost/Angular/templates/hud/paused.html'
				, start: 'XQuestHost/Angular/templates/hud/start.html'
			}
			, initialize: function() {
				this.hud = this.hudPages.start;
			}
			, registerCanvas: function(canvas) {
				this.canvas = canvas;
			}

			, startGame: function(gameMode) {
				var canvas = this.canvas;

				Balance.setGameMode(gameMode || 'arcade');

				var host = new XQuestHost(canvas);
				var game = host.game;
				game.addEvent('gamePaused', this._onGamePaused.bind(this));

				this.currentGame = game;

				this.engaged = true;
				this.fillscreen = true;

				this.hud = null;
			}
			, togglePause: function(force) {
				this.currentGame.pauseGame(force);
			}

			, _onGamePaused: function(paused) {
				if (!this.currentGame) return;

				this.paused = paused;

				if (this.paused) {
					this.hud = this.hudPages.paused;
				} else {
					this.hud = null;
				}

				// $safeApply:
				if (!$scope.$$phase) $scope.$apply();
			}

		});

		this.initialize();
	}
]);

