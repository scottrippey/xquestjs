var EnemyFactory = new Class({
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
		var spawnRate = Balance.enemies.spawnRate();
		this._nextEnemySpawn = runTime + spawnRate * 1000;
	}
	,
	_spawnNextEnemy: function() {
		// For now, we only have 1 enemy type:
		var enemyCtor = Splat;

		var game = this.game;
		var enemy = new enemyCtor(game);
		this._enemies.push(enemy);
		game.addGameItem(enemy);

		var bounds = Balance.level.bounds, initialPosition = {
			x: bounds.x + 4
			,y: bounds.y + (bounds.height / 2)
		};

		enemy.moveTo(initialPosition.x, initialPosition.y);
	}
	,
	checkBullets: function(bullets) {
		var enemies = this._enemies;
		enemies.each(function(enemy){
			var enemyLocation = enemy.location;
			var maxDistance = enemy.radius + Balance.bullets.radius;
			bullets.each(function(bullet) {
				if (Physics.distanceTest(enemyLocation, bullet, maxDistance)) {
					this.killEnemy(enemy);
				}
			}, this);
		}, this);
	}
	,
	killEnemy: function(enemy) {
		this._enemies.erase(enemy);
		enemy.setEnemyState('killed');
	}
});