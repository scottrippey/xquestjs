XQuestGame.EnemyFactory = Smart.Class({
	initialize(game) {
		this.game = game;
		this.enemies = [];
	}
	,
	onAct(tickEvent) {
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
	_calculateNextEnemySpawn(runTime) {
		var spawnRate = Balance.enemies.spawnRate();
		var spawnRateOverride = this.game.levelConfig.enemySpawnRateOverride;
		if (spawnRateOverride) spawnRate = spawnRateOverride();
		this.nextEnemySpawn = runTime + spawnRate * 1000;
	}
	,
	spawnNextEnemy() {
		var enemyPool = this.game.levelConfig.enemyPool;

		var randomEnemyIndex;
		if (enemyPool.length === 1) {
			randomEnemyIndex = 0;
		} else {
			// Prefer to spawn more difficult enemies:
			var weightedRandom = (1 - Math.pow(Math.random(), Balance.enemies.spawnDifficulty));
			randomEnemyIndex = Math.floor(weightedRandom * enemyPool.length);
		}

		var enemyCtor = enemyPool[randomEnemyIndex];

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
	getRandomSpawn(enemyRadius) {
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
	killEnemiesOnCollision(sortedItems, maxItemRadius, collisionCallback) {
		var enemies = this.enemies;
		var maxDistance = maxItemRadius + Balance.enemies.maxRadius;
		Smart.Physics.detectCollisions(enemies, sortedItems, maxDistance, (enemy, item, ei, ii, distance) => {
			if (enemy.isDead) return;

			var theseSpecificItemsDidCollide = (distance <= enemy.radius + item.radius);
			if (theseSpecificItemsDidCollide) {
				var hitPoints = item.hitPoints || 1,
					kickBack = (item.getKickBack && item.getKickBack(enemy, distance)) || null,
					stayAlive = enemy.takeDamage(hitPoints, kickBack);
				if (!stayAlive)
					enemy.isDead = true;

				if (collisionCallback)
					collisionCallback(enemy, item, ei, ii, distance);
			}
		});

		// Remove dead enemies:
		var i = enemies.length;
		while (i--) {
			if (enemies[i].isDead) {
				this.enemies.splice(i, 1);
			}
		}
	}
	,
	killAllEnemies() {
		this.enemies.forEach(enemy => {
			enemy.takeDamage(Number.POSITIVE_INFINITY, null);
		}, this);
		this.enemies.length = 0;
	}
	,
	clearAllEnemies() {
		this.enemies.forEach(enemy => {
			enemy.clearEnemy();
		});
		this.enemies.length = 0;
	}
	,
	findClosestEnemy(location) {
		var enemyLocations = this.enemies.map(enemy => enemy.location); // Perhaps this could be improved, but it's not mission-critical
		var enemyIndex = Smart.Physics.findClosestPoint(location, enemyLocations);

		return this.enemies[enemyIndex];
	}
});
