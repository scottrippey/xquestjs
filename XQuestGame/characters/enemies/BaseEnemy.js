var BaseEnemy = Class.create({
	game: null
	, enemyGraphics: null
	, location: null
	, radius: null
	, velocity: null
	,
	/* @protected */
	setupBaseEnemyGraphics: function(game, enemyName, radius) {
		this.game = game;
		this.enemyGraphics = this.game.gfx.createEnemyGraphics(enemyName);
		this.location = this.enemyGraphics;
		this.radius = radius;
	}
	,
	/* @protected */
	applyVelocityAndBounce: function(tickEvent) {
		Physics.applyVelocity(this.location, this.velocity, tickEvent.deltaSeconds);
		Physics.bounceOffWalls(this.location, this.radius, this.velocity, Balance.level.bounds);
	}
	,
	/* @protected */
	shouldChangeDirection: function(tickEvent, movementInterval) {
		var isFirstRun = (this.nextChange === undefined);
		if (isFirstRun || this.nextChange <= tickEvent.runTime) {
			this.nextChange = tickEvent.runTime + movementInterval() * 1000;
			return !isFirstRun;
		}
		return false;
	}
	,
	/* @public */
	killEnemy: function() {
		this.enemyGraphics.killEnemy(this.game.gfx, this.velocity);
	}
});
