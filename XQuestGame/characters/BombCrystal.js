var BombCrystal = Smart.Class({
	initialize: function BombCrystal(game) {
		this.game = game;
		this.location = this.game.gfx.createBombCrystalGraphic();
		this.radius = Balance.bombCrystals.radius;
	}
	, spawnBomb: function(location) {
		this.location.moveTo(location.x, location.y);
	}
	, gatherBombCrystal: function() {
		this.location.gatherBombCrystal(this.game.gfx, this.game.player.location)
			.queue(function() {
				this.game.removeGameItem(this);
				this.destroy();
			}.bind(this))
		;
	}
	, destroy: function() {
		this.location.destroy();
	}
});
