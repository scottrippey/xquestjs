/**
 * `Balance` defines all the variables that affect game play.
 * This includes everything from size, speed, timing, and quantity.
 * The values may differ depending on game mode or difficulty settings.
 */
var Balance = {
	merge(values) {
		_.merge(Balance, values);
	}
};

// Helpers:
Balance.merge({
	/** @return {Function} that returns a random integer between min and max (inclusively) */
	randomBetween(min, max) {
		return function() {
			return Math.floor(min + Math.random() * (max - min + 1));
		};
	}
	,
	/** @return {Function} that returns a random integer between min and max (inclusive, exclusive) */
	randomFloatBetween(min, max) {
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
			,bombCrystalsSpawnQuantity(game) { return 3; }
			,powerupSpawnRate: Balance.randomBetween(5, 5)
		}
		, 'easy': {
			easyMode: true
			, powerupSpawnRate: Balance.randomBetween(10, 20)
			, enemySpawnRate: Balance.randomBetween(4, 6)
		}
		, 'normal': {
			
		}
		, 'hard': {
			hardMode: true
			, enemySpawnRate: Balance.randomBetween(0.2, 1)
			, powerupSpawnRate: Balance.randomBetween(30, 60)
		}
	}
	,
	setGameMode(gameMode) {
		var gameOptions = (typeof gameMode === 'object') ? gameMode : Balance.gameModeOverrides[gameMode] || {};

		Balance.merge({
			level: {
				bounds: (function(){
					var hudHeight = 40
						, padding = 40
						, levelWidth = 1200, levelHeight = 675
						, visibleWidth = 800, visibleHeight = 450
						;
					if (gameOptions.fullView) {
						visibleWidth = padding + levelWidth + padding;
						visibleHeight = hudHeight + padding + levelHeight + padding;
					}
					return {
						hudHeight: hudHeight
						, padding: padding
						, x: padding, y: hudHeight + padding
						, visibleWidth: visibleWidth
						, visibleHeight: visibleHeight
						, width: levelWidth
						, height: levelHeight
						, totalWidth: padding + levelWidth + padding
						, totalHeight: hudHeight + padding + levelHeight + padding
					};
				})()
				, gateWidth: gameOptions.easyMode ? 300 : 200
			}
			,player: {
				radius: 12
				,kickBack: 2
				,looseFriction: 0.8
				,bounceDampening : 0.0
				,lives: 5
			}
			,bullets: {
				radius: 3
				,kickBack: 0.5
				,speed: 3 // * player speed
				,shotsPerSecond: 1.0
			}
			,bombs: {
				startCount: gameOptions.easyMode ? 5 : 3
				, speed: 1300
				, kickBack: 0.3
			}
			,crystals: {
				radius: 10
				,spawnQuantity(currentLevel) {
					var min = gameOptions.hardMode ? 30 : 12
						, multiplier = gameOptions.hardMode ? 4 : 2
						, max = gameOptions.hardMode ? 80 : 40;
					return Math.min(min + multiplier * currentLevel, max); 
				}
			}
			,powerCrystals: {
				radius: 15
				, speed: gameOptions.easyMode ? 200 : 300
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
				, sprayShot: {
					duration: 15
					, frequency: 5
					, shots: 15
					, speed: 300
					, spinSpeed: 15
				}
				, powerShot: {
					duration: 30
					, frequency: 20
				}
			}
			,enemies: {
				maxRadius: 13
				,safeSpawnDistance: 13*10
				,spawnRate: gameOptions.enemySpawnRate || Balance.randomBetween(1, 2)
				,spawnDifficulty: 1.5 // Causes more difficult enemies to spawn more frequently
				,roster: gameOptions.enemyRoster || [ XQuestGame.Slug, XQuestGame.Locust, XQuestGame.Mantis ]
				,slug: {
					radius: 13
					,speed: gameOptions.easyMode ? 60 : 80
					,movementInterval: Balance.randomBetween(3, 10)
				}
				,locust: {
					radius: 11
					,speed: gameOptions.easyMode ? 100 : 150
					,movementInterval: Balance.randomBetween(3, 5)
					,turnSpeed: Balance.randomBetween(-100, 100)
				}
				,mantis: {
					radius: 12
					,speed: 50
					,movementInterval: Balance.randomBetween(3, 6)
				}
			}
			,bonusLevel1: {
				bonusLevel: 3
				,bonusEnemySpawnRate: Balance.randomBetween(1/10, 1/10)
				,bonusPowerups: [ 'rapidFire' ]
				,bonusEnemyPool: [ XQuestGame.Slug ]
			}
			,bonusLevel2: {
				bonusLevel: 7
				,bonusEnemySpawnRate: Balance.randomBetween(1/10, 1/10)
				,bonusPowerups: [ 'invincible' ]
				,bonusEnemyPool: [ XQuestGame.Locust ]
			}
		});

		this._fireUpdate(gameOptions);
	}
});

// Events:
Balance.merge({
	onUpdate(callback) {
		if (!this._onUpdate) {
			this._onUpdate = [ callback ];
		} else {
			this._onUpdate.push(callback);
		}
	}
	,
	_fireUpdate(gameOptions) {
		if (this._onUpdate) {
			_.forEach(this._onUpdate, function(callback) {
				callback(gameOptions);
			});
		}
	}
});

