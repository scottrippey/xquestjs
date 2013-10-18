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
	togglePowerup: function(powerupName, force) {
		if (force === undefined)
			force = !this.game.powerups[powerupName];
		this.game.powerups[powerupName] = force;
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
