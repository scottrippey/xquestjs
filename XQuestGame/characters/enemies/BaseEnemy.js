XQuestGame.BaseEnemy = Smart.Class({
	game: null
	, enemyGraphics: null
	, location: null
	, radius: null
	, velocity: null
	,
	/* @protected */
	setupBaseEnemyGraphics(game, enemyName, radius) {
		this.game = game;
		this.game.addSceneItem(this);
		this.enemyGraphics = this.game.gfx.createEnemyGraphics(enemyName);
		this.location = this.enemyGraphics;
		this.radius = radius;
	}
	,
	/* @protected */
	applyVelocityAndBounce(tickEvent) {
		Smart.Physics.applyVelocity(this.location, this.velocity, tickEvent.deltaSeconds);
		Smart.Physics.bounceOffWalls(this.location, this.radius, this.velocity, Balance.level.bounds);
	}
	,
	/* @protected */
	shouldChangeDirection(tickEvent, movementInterval) {
		var isFirstRun = (this.nextChange === undefined);
		if (isFirstRun || this.nextChange <= tickEvent.runTime) {
			this.nextChange = tickEvent.runTime + movementInterval() * 1000;
			return !isFirstRun;
		}
		return false;
	}
	,
	/** @public @overridable */
	takeDamage(hitPoints, kickBack) {

		// Apply the kickback:
		if (kickBack) {
			this.velocity.x += kickBack.x;
			this.velocity.y += kickBack.y;
		}

		// Apply the damage:
		if (hitPoints >= 1) {
			this.enemyGraphics.killEnemy(this.game.gfx, this.velocity);
			this.game.removeSceneItem(this);
		}
	}
	,
	/* @public */
	clearEnemy() {
		this.game.gfx.addAnimation(new Smart.Animation()
			.duration(2).easeIn()
			.scale(this.enemyGraphics, 0)

			.queue(function() {
				this.enemyGraphics.dispose();
				this.game.removeSceneItem(this);
			}.bind(this))
		);
	}
});
