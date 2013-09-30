var Slug = Class.create(new BaseEnemy(), {
	initialize: function Slug(game) {
		var B = Balance.enemies.slug;
		this.setupBaseEnemyGraphics(game, 'Slug', B.radius);
	}
	,
	setSpawnLocation: function(x, y, side) {
		var B = Balance.enemies.slug;
		this.location.moveTo(x, y);
		this._changeDirection();
	}
	,
	onMove: function(tickEvent) {
		this.applyVelocityAndBounce(tickEvent);
	}
	,
	onAct: function(tickEvent) {
		var B = Balance.enemies.slug;
		if (this.shouldChangeDirection(tickEvent, B.movementInterval)) {
			this._changeDirection();
		}
	}
	,
	_changeDirection: function() {
		var B = Balance.enemies.slug;
		this.velocity = Point.fromAngle(Math.random() * 360, B.speed);
	}
});
