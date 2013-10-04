var Graphics;
Balance.onUpdate(function(mode) {
	Graphics = {
		player: {
			radius: Balance.player.radius
			, outerStrokeStyle: {
				strokeWidth: 3
				, strokeColor: 'white'
			}
			, innerRadius: Balance.player.radius - 2
			, innerStyle: {
				fillColor: 'hsl(60, 100%, 50%)'
			}
			, innerStarPoints: 3
			, innerStarSize: 0.7
			, spinRate: 0.3 * 360
			, particles: {
				count: 200
				,speed: 800
				,style: {
					fillColor: 'hsl(60, 100%, 50%)'
				}
				,radius: 6
				,friction: 0.9
				,getAnimation: function(particle) {
					return new Smart.Animation()
						.duration(3).easeOut()
						.fade(particle, 0)
						;
				}
			}
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
			,spinRateGathered: 1 * 360 //rps
			,gatherDuration: 1 //s
		}
		,level: {
			cornerRadius: 16
			, strokeStyle: {
				strokeWidth: 8
				, strokeColor: '#999999'
			}
		}
		,gate: {
			strokeStyle: {
				strokeWidth: 2.5
				, strokeColor: '#FF0000'
			}
			, segments: 9
			, deviation: 0.2
		}
		,background: {
			backgroundColor: 'black'
			, starColors: ['#FFFFFF','#666666','#999999', '#CCCCCC']
			, starCount: 500
		}
	};
});
