var GameDebugger = Smart.Class({
	initialize: function(game) {
		this.game = game;
	}

	, gatherClosestCrystal: function() {
		this.game.crystals.gatherClosestCrystal(this.game.player.location);
	}
	, spawnEnemy: function() {
		this.game.enemies.spawnNextEnemy();
	}
	, activatePowerup: function(powerupName) {
		this.game.activatePowerup(powerupName);
	}
	, addBomb: function() {
		this.game.stats.bombs++;
	}
	, killPlayer: function() {
		this.game.killPlayer();
	}
	, spawnPowerCrystal: function() {
		this.game.powerCrystals.createPowerCrystal();
	}
	, toggleFPS: function() {
		this.game.toggleFPS();
	}
});
