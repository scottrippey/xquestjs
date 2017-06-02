var Graphics;
Balance.onUpdate(mode => {
	Graphics = {
		merge(newGraphics) {
			_.merge(Graphics, newGraphics);
		}
	};
	Graphics.merge({
		player: {
			radius: Balance.player.radius
			, outerStrokeStyle: {
				lineWidth: Balance.player.radius * 0.25
				, strokeStyle: 'white'
			}
			, innerRadius: Balance.player.radius - 2
			, innerStyle: {
				fillStyle: 'hsl(60, 100%, 50%)'
			}
			, innerStarPoints: 3
			, innerStarSize: 0.7
			, spinRate: 0.3 * 360
			, explosionOptions: {
				count: 200
				,speed: 800
				,style: {
					fillStyle: 'hsl(60, 100%, 50%)'
				}
				,radius: 6
			}
		}
		,crystals: {
			radius: Balance.crystals.radius
			,style: {
				fillColor: 'yellow'
			}
			,sides: 6
			,pointSize: 0.5
			,spinRate: -0.1 * 360
			,spinRateGathered: 1 * 360
			,gatherDuration: 1 //s
		}
		,powerCrystals: {
			radius: Balance.powerCrystals.radius
			,style: {
				strokeColor: 'white'
				,strokeWidth: 2
			}
			,radiusInner: Balance.powerCrystals.radius * 0.5
			,styleInner: {
				fillColor: 'yellow'
				,strokeWidth: 2
			}
			,sides: 5
			,pointSize: 0.3
			,spinRate: 0.3 * 360
			,gatherDuration: 2
		}
		,bombCrystals: {
			radius: Balance.bombCrystals.radius
			,style: {
				strokeColor: 'yellow'
				,strokeWidth: 2
			}
			,radiusInner: Balance.bombCrystals.radius * 0.5
			,styleInner: {
				fillColor: 'white'
				,strokeWidth: 2
			}
			,sides: 3
			,pointSize: 0.3
			,spinRate: 0.3 * 360
			,gatherDuration: 2
		}
		,bombs: {
			style:{
				fillColor: 'white'
			}
		}
		,level: {
			cornerRadius: 16
			, strokeStyle: {
				strokeWidth: 8
				, strokeColor: '#999999'
			}
			, gateElectricityFrequency: 1000 / 30
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
	});
});
