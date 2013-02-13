var Graphics = {
	init: function() {
		Balance.addEvent('balanceChanged', this.setGraphicsMode.bind(this));
	}
	,
	setGraphicsMode: function(mode) {
		/* Key:
		 * px = pixels
		 * pps = pixels per second
		 */
		Object.merge(this, {
			player: {
				radius: Balance.player.radius
				, outerStrokeStyle: {
					strokeWidth: 3
					, strokeColor: 'white'
				}
				, innerRadius: Balance.player.radius - 2
				, innerStyle: {
					//strokeWidth: 2
					//, strokeColor: 'yellow'
					fillColor: 'yellow'
				}
				, innerStarPoints: 3
				, innerStarSize: 0.7
				, spinRate: 0.3 * 360
			}
			,bullets: {
				radius: Balance.bullets.radius
				, strokeStyle: {
					strokeWidth: 2
					, strokeColor: 'white'
				}
			}
			,crystals: {
				radius: Balance.crystals.radius
				,style: {
					fillColor: 'yellow'
				}
				,sides: 6
				,pointSize: 0.5
				,spinRate: -0.1 * 360 //rps
			}
			,enemies: {
				splat: {
					radius: Balance.enemies.splat.radius //px
					, outerFillStyle: {
						fillColor: '#009900'
					}
					, innerRadius: Balance.enemies.splat.radius * (5/8)
					, innerFillStyle: {
						fillColor: '#00DD00'
					}
					, innerStyle: {
						strokeColor: '#000000'
					}
				}
			}
			,level: {
				bounds: Balance.level.bounds
				, cornerRadius: 8
				, strokeStyle: {
					strokeWidth: 8
					, strokeColor: '#999999'
				}
			}
			,background: {
				backgroundColor: 'black'
				, starColors: ['#FFFFFF','#666666','#999999', '#CCCCCC']
				, starCount: 500
			}
		});

		// Helpers:
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
Graphics.init();