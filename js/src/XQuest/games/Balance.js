var Balance = {
	setGameMode: function(mode) {
		/* Key:
		 * px = pixels
		 * pps = pixels per second
		 */
		Object.merge(this, {
			player: {
				diameter: 12 //px
				,looseFriction: 0.8
			}
			,bullets: {
				diameter: 2 //px
				,speed: 3 // * player speed
			}
			,enemies: {
				safeDiameter: 15 //px - should be the largest enemy size
				,spawnRate: dependsOnMode({ // seconds per enemies
					'default': randomBetween(10, 20)
					,'test': randomBetween(0.5, 0.5)
				})
				,splat: {
					diameter: 8 //px
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

		function dependsOnMode(modeValues) {
			if (mode in modeValues)
				return modeValues[mode];
			return modeValues['default'];
		}

		/** @return {Function} that returns a random value between min and max (inclusively) */
		function randomBetween(min, max) {
			return function() {
				return min + Math.random() * (max - min);
			};
		}
	}
};