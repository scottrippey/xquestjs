/**
 * `Balance` defines all the variables that affect game play.
 * This includes everything from size, speed, timing, and quantity.
 * The values may differ depending on game mode or difficulty settings.
 */
var Balance = {
	merge: function(values) {
		_.merge(Balance, values);
	}
};

// Helpers:
Balance.merge({
	/** @return {Function} that returns a random integer between min and max (inclusively) */
	randomBetween: function(min, max) {
		return function() {
			return Math.floor(min + Math.random() * (max - min + 1));
		};
	}
	,
	/** @return {Function} that returns a random integer between min and max (inclusive, exclusive) */
	randomFloatBetween: function(min, max) {
		return function() {
			return (min + Math.random() * (max - min));
		};
	}
});

// Here are all the game's options:
Balance.merge({
	gameModeOverrides: {
		'arcade': { }
		,
		'test': {
			fullView: true
			,enemySpawnRate: Balance.randomBetween(1, 1)
			,bombCrystalsSpawnQuantity: function(game) { return 3; }
			,powerupSpawnRate: Balance.randomBetween(5, 5)
		}
	}
	,
	setGameMode: function(gameMode) {
		var gameOptions = (typeof gameMode === 'object') ? gameMode : Balance.gameModeOverrides[gameMode] || {};

		Balance.merge({
			level: {
				bounds: (function(){
					var padding = 40
						, visibleWidth = gameOptions.fullView ? 1200 : 800
						, visibleHeight = gameOptions.fullView ? 675 : 450
						, levelWidth = 1200, levelHeight = 675;
					return {
						x: padding, y: padding
						, visibleWidth: padding + visibleWidth + padding
						, visibleHeight: padding + visibleHeight + padding
						, width: levelWidth
						, height: levelHeight
						, totalWidth: padding + levelWidth + padding
						, totalHeight: padding + levelHeight + padding
					};
				})()
				, gateWidth: 200
			}
			,player: {
				radius: 12
				,looseFriction: 0.8
				,bounceDampening : 0.0
				,lives: 5
			}
			,bullets: {
				radius: 2
				,speed: 3 // * player speed
				,shotsPerSecond: 1.0
			}
			,bombs: {
				startCount: 3
				, speed: 1300
			}
			,crystals: {
				radius: 10
				,spawnQuantity: function(game) { return Math.min(12 + game.currentLevel, 40); }
			}
			,powerCrystals: {
				radius: 15
				, speed: 300
				, spawnAngle: Balance.randomBetween(-70, 70)
				, turnSpeed: Balance.randomBetween(-40, 40)
				, spawnRate: gameOptions.powerupSpawnRate || Balance.randomBetween(20, 40)
			}
			,bombCrystals: {
				radius: 10
				, spawnQuantity: gameOptions.bombCrystalsSpawnQuantity || function(game) { return ((game.currentLevel + 1) % 2); }
			}
			,powerups: {
				rapidFire: {
					duration: 60
					, frequency: 20
					, shotsPerSecond: 10
				}
				,
				tripleShot: {
					duration: 60
					, frequency: 20
					, angle: 10
				}
				,
				autoAim: {
					duration: 30
					, frequency: 20
					, bulletSpeed: 500
				}
				,
				invincible: {
					duration: 20
					, frequency: 10
				}
			}
			,enemies: {
				maxRadius: 13
				,safeSpawnDistance: 13*10
				,spawnRate: gameOptions.enemySpawnRate || Balance.randomBetween(2, 4)
				,spawnDifficulty: 1.5 // Causes more difficult enemies to spawn more frequently
				,roster: gameOptions.enemyRoster || [ Slug, Locust ]
				,slug: {
					radius: 13
					,speed: 80
					,movementInterval: Balance.randomBetween(3, 10)
				}
				,locust: {
					radius: 11
					,speed: 150
					,movementInterval: Balance.randomBetween(3, 5)
					,turnSpeed: Balance.randomBetween(-100, 100)
				}
			}
		});

		this._fireUpdate(gameOptions);
	}
});

// Events:
Balance.merge({
	onUpdate: function(callback) {
		if (!this._onUpdate) {
			this._onUpdate = [ callback ];
		} else {
			this._onUpdate.push(callback);
		}
	}
	,
	_fireUpdate: function(gameOptions) {
		if (this._onUpdate) {
			_.forEach(this._onUpdate, function(callback) {
				callback(gameOptions);
			});
		}
	}
});

