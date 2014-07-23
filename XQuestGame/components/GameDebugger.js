XQuestGame.GameDebugger = Smart.Class({
	initialize: function(game) {
		this.game = game;
	}

	, gatherClosestCrystal: function() {
		this.game.crystalFactory.gatherClosestCrystal(this.game.player.location);
	}
	, spawnEnemy: function() {
		this.game.enemyFactory.spawnNextEnemy();
	}
	, activatePowerup: function(powerupName) {
		this.game.activePowerups.activate(powerupName);
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
	, toggleDebugStats: function() {
		this.game.toggleDebugStats();
	}
});
