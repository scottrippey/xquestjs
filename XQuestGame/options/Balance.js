var Balance = new Events();
_.extend(Balance, {
	setGameMode: function(mode) {
		/* Key:
		 * px = pixels
		 * pps = pixels per second
		 */
		_.merge(this, {
			player: {
				radius: 12 //px
				,looseFriction: 0.8
				,bounceDampening : 0.3
			}
			,bullets: {
				radius: 2 //px
				,speed: 3 // * player speed
			}
			,crystals: {
				radius: 10 //px
				,quantity: 10
			}
			,enemies: {
				maxRadius: 13
				,spawnRate: dependsOnMode({ // seconds per enemies
					'default': randomBetween(3, 6)
					,'test': randomFloatBetween(1, 1)
				})
				,splat: {
					radius: 13 //px
					,speed: 40 //pps
					,movementInterval: randomBetween(3, 10) //seconds
				}
			}
			,level: {
				bounds: (function(){
					var padding = 40
						, visibleWidth = 800, visibleHeight = 450
						, levelWidth = visibleWidth * 2, levelHeight = visibleHeight * 2;
					return {
						x: padding, y: padding
						, visibleWidth: visibleWidth
						, visibleHeight: visibleHeight
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

		this.fireEvent('balanceChanged', [mode]);

		function dependsOnMode(modeValues) {
			if (mode in modeValues)
				return modeValues[mode];
			return modeValues['default'];
		}

		/** @return {Function} that returns a random integer between min and max (inclusively) */
		function randomBetween(min, max) {
			return function() {
				return Math.floor(min + Math.random() * (max - min + 1));
			};
		}
		/** @return {Function} that returns a random integer between min and max (inclusive, exclusive) */
		function randomFloatBetween(min, max) {
			return function() {
				return (min + Math.random() * (max - min));
			};
		}
	}
});
