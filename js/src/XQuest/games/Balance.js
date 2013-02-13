var Balance = new Events();
Object.append(Balance, {
	setGameMode: function(mode) {
		/* Key:
		 * px = pixels
		 * pps = pixels per second
		 */
		Object.merge(this, {
			player: {
				radius: 12 //px
				,looseFriction: 0.8
			}
			,bullets: {
				radius: 2 //px
				,speed: 3 // * player speed
			}
			,crystals: {
				radius: 20 //px
				,quantity: randomBetween(10, 20)
			}
			,enemies: {
				spawnRate: dependsOnMode({ // seconds per enemies
					'default': randomBetween(10, 20)
					,'test': randomFloatBetween(0.5, 0.5)
				})
				,splat: {
					radius: 8 //px
					,speed: 40 //pps
					,movementInterval: randomBetween(3, 10) //seconds
				}
			}
			,level: {
				bounds: {
					x: 10, y: 10, width: 720-10-10, height: 405-10-10
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