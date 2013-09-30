var GameDebugger = Class.create({
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
});