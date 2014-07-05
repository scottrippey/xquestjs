XQuestGame.Mantis = Smart.Class(new XQuestGame.BaseEnemy(), {
	initialize: function Mantis(game) {
		var B = Balance.enemies.mantis;
		this.setupBaseEnemyGraphics(game, 'Mantis', B.radius);
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
		var B = Balance.enemies.mantis;
		if (this.shouldChangeDirection(tickEvent, B.movementInterval)) {
			this._changeDirection();
		}
	}
	,
	_changeDirection: function() {
		var B = Balance.enemies.mantis;
		this.velocity = Smart.Point.fromAngle(Math.random() * 360, B.speed);
	}
});
