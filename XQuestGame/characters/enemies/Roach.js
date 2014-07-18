XQuestGame.Roach = Smart.Class(new XQuestGame.BaseEnemy(), {
	initialize: function Roach(game) {
		var B = Balance.enemies.roach;
		this.setupBaseEnemyGraphics(game, 'Roach', B.radius);
	}
	,
	spawn: function(spawnInfo) {
		this.location.moveTo(spawnInfo.x, spawnInfo.y);
		this._changeDirection();
	}
	,
	onMove: function(tickEvent) {
		this.applyVelocityAndBounce(tickEvent);
	}
	,
	onAct: function(tickEvent) {
		var B = Balance.enemies.roach;
		if (this.shouldChangeDirection(tickEvent, B.movementInterval)) {
			this._changeDirection();
		}
	}
	,
	_changeDirection: function() {
		var B = Balance.enemies.roach;
		this.velocity = Smart.Point.fromAngle(Math.random() * 360, B.speed);
	}
});
