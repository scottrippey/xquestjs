var Locust = Class.create({
	initialize: function(game) {
		this.game = game;
		this._setupEnemyGraphics();

		this.velocity = { x: Balance.enemies.locust.speed, y: 0 };
		this._changeDirection();
	}
	,
	_setupEnemyGraphics: function() {
		this.enemyGraphics = this.game.gfx.createEnemyGraphics('Locust');
		this.location = this.enemyGraphics;
		this.radius = Balance.enemies.locust.radius;
	}
	,
	moveTo: function(x, y) {
		this.location.moveTo(x, y);
	}
	,
	_changeDirection: function() {
		this.turnSpeed = Balance.enemies.locust.turnSpeed();
	}
	,
	_calculateNextChange: function(runTime) {
		this.nextChange = runTime + (Balance.enemies.locust.movementInterval() * 1000);
	}
	,
	onMove: function(tickEvent) {
		var rotation = tickEvent.deltaSeconds * this.turnSpeed;
		Point.rotate(this.velocity, rotation);
		this.enemyGraphics.alignWith(this.velocity);

		Physics.applyVelocity(this.location, this.velocity, tickEvent.deltaSeconds);
		Physics.bounceOffWalls(this.location, this.radius, this.velocity, Balance.level.bounds);
	}
	,
	onAct: function(tickEvent) {
		if (this.nextChange === undefined || this.nextChange <= tickEvent.runTime) {
			this._changeDirection();
			this._calculateNextChange(tickEvent.runTime);
		}
	}
	,
	killEnemy: function() {
		this.enemyGraphics.killLocust(this.game.gfx, this.velocity);
	}
});
