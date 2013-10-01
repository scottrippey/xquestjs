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
			,spawnRate: Balance.randomBetween(100, 100)
			,crystalCount: 3
		}
	}
	,
	setGameMode: function(gameMode) {
		var gameOptions = (typeof gameMode === 'object') ? gameMode : Balance.gameModeOverrides[gameMode] || {};

		Balance.merge({
			player: {
				radius: 12
				,looseFriction: 0.8
				,bounceDampening : 0.3
			}
			,powerups: {
				powerShot: {
					chargeDuration: 1.0
					, angle: 10
					, focus: 100
				}
				,
				rapidFire: {
					shotsPerSecond: 6
				}
				,
				tripleShot: {
					angle: 10
					, focus: 100
				}
				,
				autoAim: {
					bulletSpeed: 500
				}
			}
			,bullets: {
				radius: 2
				,speed: 3 // * player speed
			}
			,crystals: {
				radius: 10
				,quantity: gameOptions.crystalCount || 12
			}
			,enemies: {
				maxRadius: 13
				,spawnRate: gameOptions.spawnRate || Balance.randomBetween(3, 6)
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
			,level: {
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
			}
			,gate: {
				startingWidth: 150
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

