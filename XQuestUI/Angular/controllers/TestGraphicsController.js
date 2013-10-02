angular.module('XQuestUI').controller('TestGraphicsController', [
	'$scope', function TestGraphicsController($scope) {
		$scope.Balance = Balance;
		_.extend(this, {
			game: null
			,
			registerCanvas: function(canvas) {
				this.canvas = canvas;

				this._setupTestGame();
			}
			,
			_setupTestGame: function() {
				Balance.setGameMode('test');

				this.game = new BaseGame();
				this.game.initializeGame(this.canvas);
			}
			,
			testGraphics: function() {
				this._testLevel();
				this._testPlayersAndEnemies();
			}
			,
			_testLevel: function() {
				var levelGraphics = this.game.gfx.createLevelGraphics();
				levelGraphics.setGateWidth(Balance.level.gateWidth);
			}
			,
			_testPlayersAndEnemies: function() {
				this._applyEach(function(x, y) {
					this.game.gfx.createPlayerGraphics().moveTo(x, y);
				}, [100, 200], [100, 250], [100, 300]);

				this._applyEach(function(x, y) {
					this.game.gfx.createPlayerBullet().moveTo(x, y);
				}, [120, 200], [130, 200], [140, 200], [150, 200], [160, 200], [170, 200], [180, 200]
				 , [220, 200], [230, 200], [240, 200], [250, 200], [260, 200], [270, 200], [280, 200]
				);

				this._applyEach(function(x, y) {
					this.game.gfx.createCrystalGraphic().moveTo(x, y);
				}, [200, 200], [200, 250], [200, 300]);

				this._applyEach(function(enemy, x, y, spin) {
					var enemyGraphics = this.game.gfx.createEnemyGraphics(enemy);
					enemyGraphics.moveTo(x, y);
					if (spin) {
						this.game.gfx.addAnimation(new Smart.Animation()
							.loop(spin)
							.rotate(enemyGraphics, [0, 360])
						);
					}
				}, ['Slug', 300, 200], ['Slug', 300, 250], ['Slug', 300, 300]
				, ['Locust', 300, 350], ['Locust', 300, 400, 2], ['Locust', 300, 450, 1]);

			}
			,
			_applyEach: function(callback, args_) {
				for (var i = 1, l = arguments.length; i < l; i++) {
					callback.apply(this, arguments[i]);
				}
			}
		});
	}
]);
