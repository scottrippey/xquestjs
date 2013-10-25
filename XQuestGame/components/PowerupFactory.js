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

		if (this.bombs && this.bombs.length) {
			if (this.bombs.length >= 2) {
				Smart.Physics.sortByLocation(this.bombs);
			}

			var maxDistance = Balance.player.radius + Balance.bombCrystals.radius;

			Smart.Physics.detectCollisions(this.bombs, [ this.game.player ], maxDistance, function(bomb, player, bombIndex, pi, distance) {
				this.bombs.splice(bombIndex, 1);
				bomb.destroy();
				this.game.stats.bombs++;
			}.bind(this));


		}

	}
	,
	createPowerCrystal: function() {
		var powerCrystal = new PowerCrystal(this.game);
		var spawnInfo = this.game.enemies.getRandomSpawn(powerCrystal.radius);
		powerCrystal.spawn(spawnInfo);
		this.powerCrystals.push(powerCrystal);
	}
	,
	_nextPowerup: function() {
		var B = Balance.powerups;
		var totalFrequency = 0;
		_.forOwn(B, function(p, powerupName) {
			if (powerupName in this.game.activePowerups) return;
			totalFrequency += p.frequency;
		}, this);
		var result;
		if (totalFrequency !== 0) {
			// Choose from the available powerups:
			var randomPowerupIndex = (Math.random() * totalFrequency);
			_.forOwn(B, function (powerup, powerupName) {
				if (powerupName in this.game.activePowerups) return;
				randomPowerupIndex -= powerup.frequency;
				if (randomPowerupIndex <= 0) {
					result = powerupName;
					return false;
				}
			}, this);
		} else {
			// All powerups already gained, so start renewing some:
			result = null;
			var resultTime = null;
			_.forOwn(B, function(powerup, powerupName) {
				var activeTime = this.game.activePowerups[powerupName];

				if (resultTime === null || activeTime < resultTime) {
					resultTime = activeTime;
					result = powerupName;
				}
			}, this);
		}
		return result;
	}
	,
	_gatherOnCollision: function(collisionPoints, maxRadius) {
		var maxDistance = maxRadius + Balance.powerCrystals.radius;

		Smart.Physics.detectCollisions(this.powerCrystals, collisionPoints, maxDistance, function(powerCrystal, point, crystalIndex, pi, distance) {
			this.powerCrystals.splice(crystalIndex, 1);
			powerCrystal.gatherPowerCrystal();
			var powerupName = this._nextPowerup();
			this.game.activatePowerup(powerupName);
		}.bind(this));

	}

	,
	startLevel: function(currentLevel) {
		var frequency = 2, shouldSpawnBomb = (currentLevel % frequency === 0);
		if (shouldSpawnBomb) {
			this.createBombCrystal();
		}
	}
	,
	createBombCrystal: function() {
		var bomb = new BombCrystal(this.game);
		var random = this.game.gfx.getGamePoint('random', bomb.radius);
		bomb.spawnBomb(random);

		if (!this.bombs)
			this.bombs = [];
		this.bombs.push(bomb);
	}

	,
	clearAllPowerCrystals: function() {
		_.forEach(this.powerCrystals, function(powerCrystal) {
			powerCrystal.clearPowerCrystal();
		}, this);
		this.powerCrystals.length = 0;
	}

});
