XQuestGame.Locust = Smart.Class(new XQuestGame.BaseEnemy(), {
	initialize: function Locust(game) {
		var B = Balance.enemies.locust;
		this.setupBaseEnemyGraphics(game, 'Locust', B.radius);
	}
	,
	spawn(spawnInfo) {
		var B = Balance.enemies.locust;
		this.location.moveTo(spawnInfo.x, spawnInfo.y);
		this.velocity = Smart.Point.fromAngle((spawnInfo.side === 2 ? 180 : 0) + _.random(-20, 20), B.speed);
		this._changeTurnSpeed();
	}
	,
	_changeTurnSpeed() {
		var B = Balance.enemies.locust;
		this.turnSpeed = B.turnSpeed();
	}
	,
	onMove(tickEvent) {
		var rotation = tickEvent.deltaSeconds * this.turnSpeed;
		Smart.Point.rotate(this.velocity, rotation);

		Smart.Physics.applyVelocity(this.location, this.velocity, tickEvent.deltaSeconds);
		Smart.Physics.bounceOffWalls(this.location, this.radius, this.velocity, Balance.level.bounds);
	}
	,
	onAct(tickEvent) {
		var B = Balance.enemies.locust;
		if (this.shouldChangeDirection(tickEvent, B.movementInterval)) {
			this._changeTurnSpeed();
		}

		this.enemyGraphics.rotation = Smart.Point.angleFromVector(this.velocity);
	}
});
