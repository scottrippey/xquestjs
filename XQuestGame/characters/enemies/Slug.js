XQuestGame.Slug = Smart.Class(new XQuestGame.BaseEnemy(), {
	initialize: function Slug(game) {
		var B = Balance.enemies.slug;
		this.setupBaseEnemyGraphics(game, 'Slug', B.radius);
	}
	,
	spawn(spawnInfo) {
		this.location.moveTo(spawnInfo.x, spawnInfo.y);
		this._changeDirection();
	}
	,
	onMove(tickEvent) {
		this.applyVelocityAndBounce(tickEvent);
	}
	,
	onAct(tickEvent) {
		var B = Balance.enemies.slug;
		if (this.shouldChangeDirection(tickEvent, B.movementInterval)) {
			this._changeDirection();
		}
	}
	,
	_changeDirection() {
		var B = Balance.enemies.slug;
		this.velocity = Smart.Point.fromAngle(Math.random() * 360, B.speed);
	}
});
