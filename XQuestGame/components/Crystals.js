var Crystals = Class.create({
	initialize: function(game) {
		this.game = game;
		this.game.addGameItem(this);
		this._crystals = [];
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
			this._crystals.push(crystal);
		}

		Physics.sortByLocation(this._crystals);
	}
	,
	onAct: function(tickEvent) {

		// Check for player-collisions:
		var player = this.game.player, playerLocation = player.location;
		var maxDistance = Balance.player.radius + Balance.crystals.radius;

		var crystalsGathered = 0;
		Physics.detectCollisions(this._crystals, [ player ], maxDistance, function(crystal, player, ci, pi, distance) {
			crystal.gatherCrystal(playerLocation);
			this._crystals.splice(ci, 1);
			crystalsGathered++;
		}.bind(this));

		if (crystalsGathered) {
			this.game.crystalsGathered(this._crystals.length, crystalsGathered);
		}
	}
	,
	onDraw: function(tickEvent) {

	}
});