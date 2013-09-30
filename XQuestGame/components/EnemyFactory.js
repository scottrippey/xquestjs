var EnemyFactory = Class.create({
	initialize: function(game) {
		this.game = game;
		this.enemies = [];
	}
	,
	setLevel: function(currentLevel) {
		var currentEnemyLineupIndex = Math.floor(currentLevel / 2);

		var enemyLineup = Balance.enemies.roster;

		if (currentEnemyLineupIndex >= enemyLineup.length) {
			// Very high levels include all enemies:
			this.enemyPool = enemyLineup;
		} else if ((currentLevel % 2) === 0) {
			// Even levels only include the current enemy:
			this.enemyPool = [ enemyLineup[currentEnemyLineupIndex] ];
		} else {
			// Odd levels include a variety of enemies, up to the current level index:
			this.enemyPool = enemyLineup.slice(0, currentEnemyLineupIndex + 1);
		}
	}
	,
	onAct: function(tickEvent) {
		if (this.nextEnemySpawn == null) {
			this._calculateNextEnemySpawn(tickEvent.runTime);
		} else if (this.nextEnemySpawn <= tickEvent.runTime) {
			this.spawnNextEnemy();
			this._calculateNextEnemySpawn(tickEvent.runTime);
		}
		if (this.enemies.length >= 2) {
			Physics.sortByLocation(this.enemies);
		}
	}
	,
	_calculateNextEnemySpawn: function(runTime) {
		var spawnRate = Balance.enemies.spawnRate();
		this.nextEnemySpawn = runTime + spawnRate * 1000;
	}
	,
	spawnNextEnemy: function() {
		var enemyCtor;
		var randomEnemyIndex;
		if (this.enemyPool.length === 1) {
			randomEnemyIndex = 0;
		} else {
			// Prefer to spawn more difficult enemies:
			var weightedRandom = (1 - Math.pow(Math.random(), Balance.enemies.spawnDifficulty));
			randomEnemyIndex = Math.floor(weightedRandom * this.enemyPool.length);
		}
		enemyCtor = this.enemyPool[randomEnemyIndex];

		var enemy = new enemyCtor(this.game);
		this.enemies.push(enemy);
		this.game.addGameItem(enemy);

		var bounds = Balance.level.bounds
			, spawnSide = Math.floor(Math.random() * 2) ? 1 : 2
			, spawnInfo = {
				x: (spawnSide === 1) ? (bounds.x + enemy.radius) : (bounds.x + bounds.width - enemy.radius)
				,y: bounds.y + (bounds.height / 2)
				,side: spawnSide
			};

 		enemy.spawn(spawnInfo);
	}
	,
	killEnemiesOnCollision: function(sortedItems, maxItemRadius, collisionCallback) {
		var enemies = this.enemies;
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
		this.enemies.splice(enemyIndex, 1);
		enemy.killEnemy();
	}
});
