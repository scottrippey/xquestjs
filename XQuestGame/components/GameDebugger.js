var GameDebugger = Smart.Class({
	initialize: function(game) {
		this.game = game;
	}

	,
	gatherClosestCrystal: function() {
		this.game.crystals.gatherClosestCrystal(this.game.player.location);
	}
	,
	spawnEnemy: function() {
		this.game.enemies.spawnNextEnemy();
	}
	,
	activatePowerup: function(powerupName) {
		this.game.activatePowerup(powerupName);
	}
	,
	killPlayer: function() {
		this.game.killPlayer();
	}
	,
	spawnPowerCrystal: function() {
		this.game.powerCrystals.createPowerCrystal();
	}
});
