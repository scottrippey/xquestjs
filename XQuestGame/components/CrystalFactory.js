XQuestGame.CrystalFactory = Smart.Class({
	initialize: function(game) {
		this.game = game;
		this.game.addSceneItem(this);
		this.crystals = [];
		
		this.game.onNewLevel(this._onNewLevel.bind(this));
	}
	,
	setCrystalQuantity: function(spawnQuantity) {
		this.spawnQuantity = spawnQuantity;
	}
	,
	_onNewLevel: function() {
		this._spawnCrystals();
	},
	_spawnCrystals: function() {
		var spawnQuantity = this.spawnQuantity;
		
		// Clean up:
		this.crystals.forEach(function(crystal) {
			crystal.dispose();
		}, this);
		this.crystals = [];

		var radius = Balance.crystals.radius;

		this.game.stats.crystalCount = spawnQuantity;

		while (spawnQuantity--) {
			var crystal = this.game.gfx.createCrystalGraphic();
			var spawnPoint = this.game.gfx.getSafeSpawn(radius);
			crystal.moveTo(spawnPoint.x, spawnPoint.y);
			crystal.location = crystal;
			this.crystals.push(crystal);
		}

		Smart.Physics.sortByLocation(this.crystals);
	}
	,
	onAct: function(tickEvent) {

		// Check for player-collisions:
		var player = this.game.player;
		this._gatherOnCollision([ player ], player.radius);
	}
	,
	_gatherOnCollision: function(collisionPoints, maxRadius) {

		var maxDistance = maxRadius + Balance.crystals.radius;

		var crystalsGathered = 0;
		Smart.Physics.detectCollisions(this.crystals, collisionPoints, maxDistance, function(crystal, point, crystalIndex, pi, distance) {
			crystal.gatherCrystal(this.game.gfx, this.game.player.location);
			this.crystals.splice(crystalIndex, 1);
			crystalsGathered++;
		}.bind(this));

		if (crystalsGathered) {
			this.game.crystalsGathered(this.crystals.length, crystalsGathered);
			this.game.stats.crystalCount -= crystalsGathered;
		}
	}
	,
	gatherClosestCrystal: function(location) {
		if (!this.crystals.length) return;

		var crystalIndex = Smart.Physics.findClosestPoint(location, this.crystals)
			,crystal = this.crystals[crystalIndex];

		crystal.gatherCrystal(this.game.gfx, this.game.player.location);
		this.crystals.splice(crystalIndex, 1);

		this.game.crystalsGathered(this.crystals.length, 1);

		this.game.stats.crystalCount -= 1;
	}
});
