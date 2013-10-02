var Crystals = Smart.Class({
	initialize: function(game) {
		this.game = game;
		this.game.addGameItem(this);
		this.crystals = [];
	}
	,
	createCrystals: function(count) {
		var bounds = Balance.level.bounds
			,radius = Balance.crystals.radius
			,randomX = function() { return bounds.x + radius + Math.random() * (bounds.width - radius * 2); }
			,randomY = function() { return bounds.y + radius + Math.random() * (bounds.height - radius * 2); };


		while (count--) {
			var crystal = this.game.gfx.createCrystalGraphic();
			crystal.x = randomX();
			crystal.y = randomY();
			crystal.location = crystal;
			this.crystals.push(crystal);
		}

		Physics.sortByLocation(this.crystals);
	}
	,
	clearCrystals: function() {
		this.crystals.forEach(function(crystal) {
			this.game.gfx.removeGraphic(crystal);
		}, this);
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
		Physics.detectCollisions(this.crystals, collisionPoints, maxDistance, function(crystal, point, crystalIndex, pi, distance) {
			crystal.gatherCrystal(this.game.gfx, this.game.player.location);
			this.crystals.splice(crystalIndex, 1);
			crystalsGathered++;
		}.bind(this));

		if (crystalsGathered) {
			this.game.crystalsGathered(this.crystals.length, crystalsGathered);
		}
	}
	,
	gatherClosestCrystal: function(location) {
		if (!this.crystals.length) return;

		var crystalIndex = Physics.findClosestPoint(location, this.crystals)
			,crystal = this.crystals[crystalIndex];

		crystal.gatherCrystal(this.game.gfx, this.game.player.location);
		this.crystals.splice(crystalIndex, 1);

		this.game.crystalsGathered(this.crystals.length, 1);
	}
	,
	onDraw: function(tickEvent) {

	}
});