var SplatGraphics = function() {

	this._setupGraphics();

};
SplatGraphics.prototype = new createjs.Shape();
SplatGraphics.implement({

	variables: {
		outerFillStyle: {
			fillColor: '#009900'
		}
		, innerDiameterRatio: 5/8
		, innerFillStyle: {
			fillColor: '#00DD00'
		}
		, innerStrokeStyle: {
			strokeColor: '#000000'
		}
		, particles: {
			speed: 500
			,style: {
				fillColor: 'green'
			}
			,radius: 2
			,friction: 0.9
			,velocity: { x: 0, y: 0 }
		}
	}
	,
	_setupGraphics: function(){
		var g = this.graphics, v = this.variables;
		g.clear();

		g.beginStyle(v.outerFillStyle)
			.drawCircle(0, 0, Balance.enemies.splat.diameter)
			.endFill();
		g.beginStyle(v.innerFillStyle)
			.drawCircle(0, 0, v.innerDiameter)
			.endFill()
			.beginStyle(v.innerStrokeStyle)
			.drawCircle(0, 0, Balance.enemies.splat.diameter * v.innerDiameterRatio)
			.endStroke();

	}

	, moveTo: function(x, y) {
		this.x = x;
		this.y = y;
	}

	,
	killSplat: function(gfx, velocity) {
		var enemyGraphics = this;
		gfx.removeGraphic(enemyGraphics);

		var particleOptions = this.variables.particles;
		particleOptions.position = enemyGraphics;

		var particleCount = 10, partSpeed = particleOptions.speed;
		for (var i = 0; i < particleCount; i++) {
			particleOptions.velocity.x = velocity.x + partSpeed - 2 * partSpeed * Math.random();
			particleOptions.velocity.y = velocity.y + partSpeed - 2 * partSpeed * Math.random();
			gfx.addParticle(particleOptions);
		}
	}
});
