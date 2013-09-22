angular.module('XQuestUI').controller('TestGraphicsController', [
	function TestGraphicsController() {
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

				this.game.gfx.createLevelGraphics();

				this.game.gfx.createPlayerGraphics().moveTo(100, 200);
				this.game.gfx.createPlayerGraphics().moveTo(100, 250);
				this.game.gfx.createPlayerGraphics().moveTo(100, 300);

				this.game.gfx.createPlayerBullet().moveTo(120, 200);
				this.game.gfx.createPlayerBullet().moveTo(130, 200);
				this.game.gfx.createPlayerBullet().moveTo(140, 200);
				this.game.gfx.createPlayerBullet().moveTo(150, 200);
				this.game.gfx.createPlayerBullet().moveTo(160, 200);
				this.game.gfx.createPlayerBullet().moveTo(170, 200);
				this.game.gfx.createPlayerBullet().moveTo(180, 200);

				this.game.gfx.createPlayerBullet().moveTo(220, 200);
				this.game.gfx.createPlayerBullet().moveTo(230, 200);
				this.game.gfx.createPlayerBullet().moveTo(240, 200);
				this.game.gfx.createPlayerBullet().moveTo(250, 200);
				this.game.gfx.createPlayerBullet().moveTo(260, 200);
				this.game.gfx.createPlayerBullet().moveTo(270, 200);
				this.game.gfx.createPlayerBullet().moveTo(280, 200);

				this.game.gfx.createCrystalGraphic().moveTo(200, 200);
				this.game.gfx.createCrystalGraphic().moveTo(200, 250);
				this.game.gfx.createCrystalGraphic().moveTo(200, 300);

				this.game.gfx.createEnemyGraphics('Slug').moveTo(300, 200);
				this.game.gfx.createEnemyGraphics('Slug').moveTo(300, 250);
				this.game.gfx.createEnemyGraphics('Slug').moveTo(300, 300);
			}
		});
	}
]);
