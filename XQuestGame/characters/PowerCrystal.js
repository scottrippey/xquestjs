XQuestGame.PowerCrystal = Smart.Class({
	initialize(game) {
		var B = Balance.powerCrystals;
		this.game = game;
		this.game.addSceneItem(this);

		this.location = this.game.gfx.createPowerCrystalGraphic();
		this.radius = B.radius;


		this.turnSpeed = B.turnSpeed();
	}
	,
	spawn(spawnInfo) {
		var B = Balance.powerCrystals;

		this.location.moveTo(spawnInfo.x, spawnInfo.y);
		this.velocity = { x: B.speed, y: 0 };
		Smart.Point.rotate(this.velocity, B.spawnAngle());
		if (spawnInfo.side === 2) {
			this.velocity.x *= -1;
		}
	}
	,
	onMove(tickEvent) {
		var powerCrystal = this;

		// Turn:
		Smart.Point.rotate(powerCrystal.velocity, powerCrystal.turnSpeed * tickEvent.deltaSeconds);

		Smart.Physics.applyVelocity(powerCrystal.location, powerCrystal.velocity, tickEvent.deltaSeconds);
		Smart.Physics.bounceOffWalls(powerCrystal.location, powerCrystal.radius, powerCrystal.velocity, Balance.level.bounds);

	}
	,
	gatherPowerCrystal() {
		this.location.gatherPowerCrystal(this.game.gfx, this.game.player.location)
			.queue(function() {
				this.game.removeSceneItem(this);
			}.bind(this))
		;
	}
	,
	clearPowerCrystal() {
		this.location.clearPowerCrystal(this.game.gfx)
			.queue(function() {
				this.game.removeSceneItem(this);
			}.bind(this))
		;
	}
});
