var Locust = Class.create(new BaseEnemy(), {
	initialize: function Locust(game) {
		var B = Balance.enemies.locust;
		this.setupBaseEnemyGraphics(game, 'Locust', B.radius);
	}
	,
	spawn: function(spawnInfo) {
		var B = Balance.enemies.locust;
		this.location.moveTo(spawnInfo.x, spawnInfo.y);
		this.velocity = Point.fromAngle((spawnInfo.side === 2 ? 180 : 0) + _.random(-20, 20), B.speed);
		this._changeTurnSpeed();
	}
	,
	_changeTurnSpeed: function() {
		var B = Balance.enemies.locust;
		this.turnSpeed = B.turnSpeed();
	}
	,
	onMove: function(tickEvent) {
		var rotation = tickEvent.deltaSeconds * this.turnSpeed;
		Point.rotate(this.velocity, rotation);

		Physics.applyVelocity(this.location, this.velocity, tickEvent.deltaSeconds);
		Physics.bounceOffWalls(this.location, this.radius, this.velocity, Balance.level.bounds);
	}
	,
	onAct: function(tickEvent) {
		var B = Balance.enemies.locust;
		if (this.shouldChangeDirection(tickEvent, B.movementInterval)) {
			this._changeTurnSpeed();
		}

		this.enemyGraphics.alignWith(this.velocity);
	}
});
