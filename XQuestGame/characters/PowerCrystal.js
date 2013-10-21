var PowerCrystal = Smart.Class({
	initialize: function(game, powerupName) {
		var B = Balance.powerCrystals;
		this.game = game;
		this.game.addGameItem(this);

		this.location = this.game.gfx.createPowerCrystalGraphic();
		this.radius = B.radius;


		this.turnSpeed = B.turnSpeed();
		this.powerupName = powerupName;

	}
	,
	spawn: function(spawnInfo) {
		var B = Balance.powerCrystals;

		this.location.moveTo(spawnInfo.x, spawnInfo.y);
		this.velocity = { x: B.speed, y: 0 };
		Smart.Point.rotate(this.velocity, B.spawnAngle());
		if (spawnInfo.side === 2) {
			this.velocity.x *= -1;
		}
	}
	,
	onMove: function(tickEvent) {
		var powerCrystal = this;

		// Turn:
		Smart.Point.rotate(powerCrystal.velocity, powerCrystal.turnSpeed * tickEvent.deltaSeconds);

		Smart.Physics.applyVelocity(powerCrystal.location, powerCrystal.velocity, tickEvent.deltaSeconds);
		Smart.Physics.bounceOffWalls(powerCrystal.location, powerCrystal.radius, powerCrystal.velocity, Balance.level.bounds);

	}
	,
	gatherPowerCrystal: function() {
		this.location.gatherPowerCrystal(this.game.gfx, this.game.player.location)
			.queue(function() {
				this.game.removeGameItem(this);
			}.bind(this))
		;
	}
	,
	clearPowerCrystal: function() {
		this.location.clearPowerCrystal(this.game.gfx)
			.queue(function() {
				this.game.removeGameItem(this);
			}.bind(this))
		;
	}
});
