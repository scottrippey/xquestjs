var EnemyFactory = new Class({

	variables: {
		interval: {
			minimumS: 5
			,maximumS: 15
		}
	}
	,
	_enemies: []
	,
	_nextEnemySpawn: null
	,
	initialize: function(game) {
		this.game = game;
	}
	,
	onAct: function(tickEvent) {
		if (this._nextEnemySpawn == null) {
			this._calculateNextEnemySpawn(tickEvent.runTime);
		} else if (this._nextEnemySpawn <= tickEvent.runTime) {
			this._spawnNextEnemy();
			this._calculateNextEnemySpawn(tickEvent.runTime);
		}
	}
	,
	_calculateNextEnemySpawn: function(runTime) {
		var interval = this.variables.interval
			, nextEnemySpawnS = (interval.minimumS + Math.random() * (interval.maximumS - interval.minimumS));
		this._nextEnemySpawn = runTime + nextEnemySpawnS * 1000;
	}
	,
	_spawnNextEnemy: function() {
		// For now, we only have 1 enemy type:
		var enemyCtor = Splat;

		var game = this.game;
		var enemy = new enemyCtor(game);
		this._enemies.push(enemy);
		game.addGameItem(enemy);

		var bounds = this.game.level.bounds, initialPosition = {
			x: bounds.x + 4
			,y: bounds.y + (bounds.height / 2)
		};

		enemy.moveTo(initialPosition.x, initialPosition.y);
	}
});