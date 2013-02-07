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
	,
	setEnemyState: function(state) {
		switch (state) {
			case "killed":
				this.game.gfx.removeGraphic(this.enemyGraphics);
				break;
		}
	}
});