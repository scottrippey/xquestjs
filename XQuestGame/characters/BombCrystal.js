var BombCrystal = Smart.Class({
	initialize: function BombCrystal(game) {
		this.game = game;
		this.location = this.game.gfx.createBombCrystalGraphic();
		this.radius = Balance.bombCrystals.radius;
	}
	,
	spawnBomb: function(location) {
		this.location.moveTo(location.x, location.y);
	}
	,
	destroy: function() {
		this.location.destroy();
	}
});
