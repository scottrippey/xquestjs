var EnemyFactory = Class.create({
	enemyLineup: null
	, enemyPool: null
	, _enemies: []
	, _nextEnemySpawn: null
	,
	initialize: function(game) {
		this.game = game;

		this._setupEnemyLineup();

		this.game.events.onLevelUp(this._onLevelUp.bind(this));
		this._onLevelUp();
	}
	,
	_setupEnemyLineup: function() {
		this.enemyLineup = [
			Slug
			,Locust
		];
	}
	,
	_onLevelUp: function() {
		var currentLevel = this.game.currentLevel;

		var currentEnemyLineupIndex = Math.floor(currentLevel / 2);

		if (currentEnemyLineupIndex >= this.enemyLineup.length) {
			// Very high levels include all enemies:
			this.enemyPool = this.enemyLineup;
		} else if ((currentLevel % 2) === 0) {
			// Even levels include a variety of enemies, up to the current level index:
			this.enemyPool = this.enemyLineup.slice(0, currentEnemyLineupIndex + 1);
		} else {
			// Odd levels only include the current enemy:
			this.enemyPool = [ this.enemyLineup[currentEnemyLineupIndex] ];
		}
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
		var enemyCtor;
		if (this.enemyPool.length === 1) {
			enemyCtor = this.enemyPool[0];
		} else {
			// Prefer to spawn more difficult enemies:
			var weightedRandom = (1 - Math.pow(Math.random(), Balance.enemies.spawnDifficulty));
			var randomEnemyIndex = Math.floor(weightedRandom * this.enemyPool.length);
			enemyCtor = this.enemyPool[randomEnemyIndex];
		}

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
