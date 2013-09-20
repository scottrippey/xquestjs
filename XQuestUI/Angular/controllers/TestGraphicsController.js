angular.module('XQuestUI').controller('TestGraphicsController', [
	function TestGraphicsController() {
		_.extend(this, {
			gfx: null
			,
			registerCanvas: function(canvas) {

				this.canvas = canvas;

				this._setupGraphics();
			}
			,
			_setupGraphics: function() {
				Balance.setGameMode('arcade');

				this.gfx = new EaselJSGraphics(this.canvas);

				var playerLocation = this.gfx.createPlayerGraphics();
				playerLocation.moveTo(100, 100);
			}
			,
			testSlug: function() {
				var slug = this.gfx.createEnemyGraphics('Slug');

				slug.moveTo(50, 100);

				var tickEvent = {};
				this._tickHandler(tickEvent);
			}
			,
			_tickHandler: function(tickEvent) {
				this.gfx.onAct(tickEvent);
				this.gfx.onDraw(tickEvent);
			}
		});
	}
]);