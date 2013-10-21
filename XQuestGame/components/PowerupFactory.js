var PowerupFactory = Smart.Class({
	initialize: function(game) {
		this.game = game;
		this.game.addGameItem(this);
		this.powerCrystals = [];
	}
	,
	onMove: function(tickEvent) {
		if (this._shouldSpawn(tickEvent)) {
			this.createPowerCrystal();
		}
	}
	,
	_shouldSpawn: function(tickEvent) {
		var B = Balance.powerCrystals;

		// TODO: Make this performance-based instead of time-based:
		var isFirstRun = (this.nextSpawn === undefined);
		var shouldSpawn = !isFirstRun && (this.nextSpawn <= tickEvent.runTime);
		if (isFirstRun || shouldSpawn) {
			this.nextSpawn = tickEvent.runTime + B.spawnRate() * 1000;
		}
		return shouldSpawn;
	}
	,
	onAct: function(tickEvent) {
		if (this.powerCrystals.length >= 2) {
			Smart.Physics.sortByLocation(this.powerCrystals);
		}

		// Check for bullet-collisions:

		// Check for player-collisions:
		var player = this.game.player;
		this._gatherOnCollision([ player ], player.radius);

	}
	,
	createPowerCrystal: function() {
		var powerCrystal = new PowerCrystal(this.game, this._randomPowerup());

		var spawnInfo = this.game.enemies.getRandomSpawn(powerCrystal.radius);
		powerCrystal.spawn(spawnInfo);
		this.powerCrystals.push(powerCrystal);
	}
	,
	_randomPowerup: function() {
		var B = Balance.powerups;
		var totalFrequency = 0;
		_.forOwn(B, function(p) {
			totalFrequency += p.frequency;
		});
		var randomPowerupIndex = (Math.random() * totalFrequency), result;
		_.forOwn(B, function(p, name) {
			randomPowerupIndex -= p.frequency;
			if (randomPowerupIndex <= 0){
				result = name;
				return false;
			}
		});
		return result;
	}
	,
	_gatherOnCollision: function(collisionPoints, maxRadius) {
		var maxDistance = maxRadius + Balance.powerCrystals.radius;

		Smart.Physics.detectCollisions(this.powerCrystals, collisionPoints, maxDistance, function(powerCrystal, point, crystalIndex, pi, distance) {
			this.powerCrystals.splice(crystalIndex, 1);
			powerCrystal.gatherPowerCrystal();
			this.game.activatePowerup(powerCrystal.powerupName);
		}.bind(this));

	}

	,
	clearAllPowerCrystals: function() {
		_.forEach(this.powerCrystals, function(powerCrystal) {
			powerCrystal.clearPowerCrystal();
		}, this);
		this.powerCrystals.length = 0;
	}

});
