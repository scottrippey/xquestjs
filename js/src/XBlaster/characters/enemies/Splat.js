var Splat = new Class({
	variables: {
		speed: 40
		, interval: 10
	}
	,

	initialize: function(game) {
		this.game = game;
		this._setupEnemyGraphics();
		this.velocity = {
			x: 0
			,y: 0
		}
	}
	,
	_setupEnemyGraphics: function() {
		this.enemyGraphics = this.game.gfx.createEnemyGraphics('Splat');
	}
	, moveTo: function(x, y) {
		this.enemyGraphics.moveTo(x, y);
	}
	,
	onMove: function(tickEvent) {
		Physics.applyVelocity(this.enemyGraphics, this.velocity, tickEvent.deltaSeconds);
		Physics.bounceOffWalls(this.enemyGraphics, this.enemyGraphics.variables.outerDiameter, this.velocity, this.game.level.bounds);
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
		this.nextChange = runTime + (this.variables.interval * 1000);
	}
	,
	_changeDirection: function() {
		var speed = this.variables.speed
			,angle = Math.random() * Math.PI * 2;
		this.velocity = {
			x: Math.cos(angle) * speed
			,y: Math.sin(angle) * speed
		};

	}
});