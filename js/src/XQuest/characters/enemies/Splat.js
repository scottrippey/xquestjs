var Splat = new Class({
	initialize: function(game) {
		this.game = game;
		this._setupEnemyGraphics();
		this.velocity = { x: 0, y: 0 };
	}
	,
	_setupEnemyGraphics: function() {
		this.enemyGraphics = this.game.gfx.createEnemyGraphics('Splat');
		this.location = this.enemyGraphics;
		this.diameter = Balance.enemies.splat.diameter;
	}
	, moveTo: function(x, y) {
		this.location.moveTo(x, y);
	}
	,
	onMove: function(tickEvent) {
		Physics.applyVelocity(this.location, this.velocity, tickEvent.deltaSeconds);
		Physics.bounceOffWalls(this.location, this.diameter, this.velocity, Balance.level.bounds);
	}
	,
	onAct: function(tickEvent) {
		if (this.nextChange == null) {
			this._changeDirection();
			this._calculateNextChange(tickEvent.runTime);
		} else if (this.nextChange <= tickEvent.runTime) {
			this._changeDirection();
			this._calculateNextChange(tickEvent.runTime);
		}
	}
	,
	_calculateNextChange: function(runTime) {
		this.nextChange = runTime + (Balance.enemies.splat.movementInterval() * 1000);
	}
	,
	_changeDirection: function() {
		var speed = Balance.enemies.splat.speed
			,angle = Math.random() * Math.PI * 2;
		this.velocity = {
			x: Math.cos(angle) * speed
			,y: Math.sin(angle) * speed
		};

	}
	,
	setEnemyState: function(state) {
		switch (state) {
			case "killed":
				this.enemyGraphics.killSplat(this.game.gfx, this.velocity);
				break;
		}
	}
});