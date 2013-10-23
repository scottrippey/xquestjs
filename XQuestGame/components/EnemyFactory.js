var EnemyFactory = Smart.Class({
	initialize: function(game) {
		this.game = game;
		this.enemies = [];
	}
	,
	startLevel: function(currentLevel) {
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
			Smart.Physics.sortByLocation(this.enemies);
		}
	}
	,
	_calculateNextEnemySpawn: function(runTime) {
		var spawnRate = Balance.enemies.spawnRate();
		this.nextEnemySpawn = runTime + spawnRate * 1000;
	}
	,
	spawnNextEnemy: function() {

		var randomEnemyIndex;
		if (this.enemyPool.length === 1) {
			randomEnemyIndex = 0;
		} else {
			// Prefer to spawn more difficult enemies:
			var weightedRandom = (1 - Math.pow(Math.random(), Balance.enemies.spawnDifficulty));
			randomEnemyIndex = Math.floor(weightedRandom * this.enemyPool.length);
		}

		var enemyCtor = this.enemyPool[randomEnemyIndex];

		var enemy = new enemyCtor(this.game);
		this.enemies.push(enemy);

		var spawnInfo = this.getRandomSpawn(enemy.radius);
 		enemy.spawn(spawnInfo);
		this.game.gfx.addAnimation(new Smart.Animation()
			.duration(1).easeOut('quint')
			.scale(enemy.location, [0, 1])
		).update(0);
	}
	,
	getRandomSpawn: function(enemyRadius) {
		var bounds = Balance.level.bounds
			, spawnSide = Math.floor(Math.random() * 2) ? 1 : 2
			, spawnInfo = {
				x: (spawnSide === 1) ? (bounds.x + enemyRadius) : (bounds.x + bounds.width - enemyRadius)
				,y: bounds.y + (bounds.height / 2)
				,side: spawnSide
			};
		return spawnInfo;
	}
	,
	killEnemiesOnCollision: function(sortedItems, maxItemRadius, collisionCallback) {
		var enemies = this.enemies;
		var maxDistance = maxItemRadius + Balance.enemies.maxRadius;
		Smart.Physics.detectCollisions(enemies, sortedItems, maxDistance, function(enemy, item, ei, ii, distance){
			var theseSpecificItemsDidCollide = (distance <= enemy.radius + item.radius);
			if (theseSpecificItemsDidCollide) {
				enemy.mustDie = true;
				if (collisionCallback)
					collisionCallback(enemy, item, ei, ii, distance);
			}
		}.bind(this));

		var i = enemies.length;
		while (i--) {
			if (enemies[i].mustDie) {
				this._killEnemy(enemies[i], i);
			}
		}
	}
	,
	killAllEnemies: function() {
		this.enemies.forEach(function(enemy) { enemy.killEnemy(); });
		this.enemies.length = 0;
	}
	,
	clearAllEnemies: function() {
		this.enemies.forEach(function(enemy) {
			enemy.clearEnemy();
		});
		this.enemies.length = 0;
	}
	,
	_killEnemy: function(enemy, enemyIndex) {
		enemy.killEnemy();
		this.enemies.splice(enemyIndex, 1);
	}
	,
	findClosestEnemy: function(location) {
		var enemyLocations = this.enemies.map(function(enemy) { return enemy.location; }); // Perhaps this could be improved, but it's not mission-critical
		var enemyIndex = Smart.Physics.findClosestPoint(location, enemyLocations);

		return this.enemies[enemyIndex];
	}
});
