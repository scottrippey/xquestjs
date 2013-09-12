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
		if (this._enemies.length >= 2) {
			Physics.sortByLocation(this._enemies);
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

		var bounds = Balance.level.bounds
			, spawnSide = Math.floor(Math.random() * 2) ? 1 : 2
			, initialPosition = {
				x: (spawnSide === 1) ? (bounds.x + enemy.radius) : (bounds.x + bounds.width - 0 - enemy.radius)
				,y: bounds.y + (bounds.height / 2)
			};

		enemy.moveTo(initialPosition.x, initialPosition.y);
	}
	,
	killEnemiesOnCollision: function(sortedItems, maxItemRadius, collisionCallback) {
		var enemies = this._enemies;
		var maxDistance = maxItemRadius + Balance.enemies.maxRadius;
		Physics.detectCollisions(enemies, sortedItems, maxDistance, function(enemy, item, ei, ii, distance){
			var theseSpecificItemsDidCollide = (distance <= enemy.radius + item.radius);
			if (theseSpecificItemsDidCollide) {
				this._killEnemy(enemy, ei);
				if (collisionCallback)
					collisionCallback(enemy, item, ei, ii, distance);
			}
		}.bind(this));
	}
	,
	_killEnemy: function(enemy, enemyIndex) {
		this._enemies.splice(enemyIndex, 1);
		enemy.setEnemyState('killed');
	}
});
