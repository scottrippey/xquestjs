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
				bounds: {
					x: 40, y: 40, width: 1000, height: 700
				}
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
