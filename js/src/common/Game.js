define('Game', function() {
	var Game = new Class({

		options: {
			fps: 60
		}
		,
		timer: null
		,
		lastTimestamp: null
		,
		gfx: null

		,
		initialize: function(gfx) {
			this.lastTimestamp = new Date().getTime();
			this.gameLoopTimer = this.gameLoop.periodical(1000 / this.options.fps, this);
			this.gfx = gfx;
		}
		,
		gameLoop: function() {
			var elapsed = (new Date().getTime() - this.lastTimestamp) / 1000;

			this.gameUpdate(elapsed);
			this.gameDraw();
		}

		,
		gameUpdate: function(elapsed) {
			this.updateItems.each(function(item){
				item.update(elapsed);
			});
		}
		,
		gameDraw: function() {
			var gfx = this.gfx;
			this.drawItems.each(function(item){
				item.draw(gfx);
			});
		}
	});
	return Game;
});