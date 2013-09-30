var Balance = {
	setGameMode: function(mode) {
		if (!this._onUpdate) {
			 return;
		}
		_.forEach(this._onUpdate, function(callback) {
			callback(mode);
		});
	}
	,
	onUpdate: function(callback) {
		if (!this._onUpdate) {
			this._onUpdate = [ callback ];
		} else {
			this._onUpdate.push(callback);
		}
	}
	,
	dependsOn: function(mode, modeValues) {
		if (mode in modeValues)
			return modeValues[mode];
		return modeValues['default'];
	}
	,
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
};

Balance.onUpdate(function(mode) {
	_.merge(Balance, {
		player: {
			radius: 12
			,looseFriction: 0.8
			,bounceDampening : 0.3
		}
		,bullets: {
			radius: 2
			,speed: 3 // * player speed
		}
		,crystals: {
			radius: 10
			,quantity: Balance.dependsOn(mode, {
				'default': 12
				,'test': 3
			})
		}
		,enemies: {
			maxRadius: 13
			,spawnRate: Balance.dependsOn(mode, {
				'default': Balance.randomBetween(3, 6)
				,'test': Balance.randomFloatBetween(1, 1)
			})
			,spawnDifficulty: 1.5 // Causes more difficult enemies to spawn more frequently
			,splat: {
				radius: 13
				,speed: 40
				,movementInterval: Balance.randomBetween(3, 10)
			}
			,locust: {
				radius: 10
				,speed: 150
				,movementInterval: Balance.randomBetween(3, 5)
				,turnSpeed: Balance.randomBetween(-100, 100)
			}
		}
		,level: {
			bounds: (function(){
				var padding = 40
					, visibleWidth = Balance.dependsOn(mode, { 'test': 1200, 'default': 800 })
					, visibleHeight = Balance.dependsOn(mode, { 'test': 675, 'default': 450 })
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
});
