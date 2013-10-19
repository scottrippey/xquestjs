var PowerupFactory = Smart.Class({
	initialize: function(game) {
		this.game = game;
		this.game.addGameItem(this);
		this.powerCrystals = [];
	}
	,
	onMove: function(tickEvent) {
		this.powerCrystals.forEach(function(powerCrystal) {

			// Spin:
			powerCrystal.rotation += Graphics.powerCrystals.spinRate * tickEvent.deltaSeconds;

			// Turn:
			Smart.Point.rotate(powerCrystal.velocity, powerCrystal.turnSpeed * tickEvent.deltaSeconds)

			Smart.Physics.applyVelocity(powerCrystal, powerCrystal.velocity, tickEvent.deltaSeconds);
			Smart.Physics.bounceOffWalls(powerCrystal, powerCrystal.radius, powerCrystal.velocity, Balance.level.bounds);

		});

		if (this._shouldSpawn(tickEvent)) {
			this.createPowerCrystal();
		}

		if (this.powerCrystals.length >= 2) {
			Smart.Physics.sortByLocation(this.powerCrystals);
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
		// Check for bullet-collisions:

		// Check for player-collisions:
		var player = this.game.player;
		this._gatherOnCollision([ player ], player.radius);

	}
	,
	createPowerCrystal: function() {
		var B = Balance.powerCrystals;

		var powerCrystal = this.game.gfx.createPowerCrystalGraphic();
		powerCrystal.location = powerCrystal;
		powerCrystal.radius = B.radius;
		powerCrystal.turnSpeed = B.turnSpeed();
		powerCrystal.powerupName = this._randomPowerup();

		// Set initial position and velocity:
		var spawnInfo = this.game.enemies.getRandomSpawn(powerCrystal.radius);
		powerCrystal.moveTo(spawnInfo.x, spawnInfo.y);
		powerCrystal.velocity = { x: B.speed, y: 0 };
		Smart.Point.rotate(powerCrystal.velocity, B.spawnAngle());
		if (spawnInfo.side === 2) {
			powerCrystal.velocity.x *= -1;
		}

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
			powerCrystal.gatherPowerCrystal(this.game.gfx, this.game.player.location);
			this.game.activatePowerup(powerCrystal.powerupName);
		}.bind(this));

	}

	,
	clearAllPowerCrystals: function() {
		_.forEach(this.powerCrystals, function(powerCrystal) {
			powerCrystal.clearPowerCrystal(this.game.gfx)
				.queue(function() {
					this.powerCrystals.splice(this.powerCrystals.indexOf(powerCrystal), 1);
				}.bind(this));
		}, this);
	}

});
