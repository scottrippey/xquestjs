Balance.onUpdate(function(gameMode) {
	Graphics.merge({
		explosionOptions: {
			count: 200
			,speed: 800
			,style: {
				fillColor: 'hsl(60, 100%, 50%)'
			}
			,radius: 4
			,friction: 0.9
			,duration: 3
		}
	});
});

EaselJSGraphics.ExplosionGraphic = Smart.Class(new EaselJSGraphics.Drawing(), {
	setup: function(position, velocity, explosionOptions) {
		this.explosionOptions = _.defaults(explosionOptions, Graphics.explosionOptions);

		var random = function() { return 1 - Math.random() - Math.random(); }; // provides a more even spread than just Math.random()
		
		this.particles = new Array(explosionOptions.count);
		for (var i = 0, l = explosionOptions.count; i < l; i++) {
			
			var vx = velocity.x + explosionOptions.speed * random(), 
				vy = velocity.y + explosionOptions.speed * random();
			
			this.particles[i] = {
				x: position.x, y: position.y
				, velocity: { x: vx, y: vy }
			};
		}
		
		this.addAnimation()
			.duration(explosionOptions.duration).easeOut().fade(this, 0).queueDispose(this);
		
	}
	,drawEffects: function(drawing, tickEvent) {
		var explosionOptions = this.explosionOptions,
			particles = this.particles,
			deltaSeconds = tickEvent.deltaSeconds,
			levelBounds = Balance.level.bounds;

		drawing.beginPath();
		for (var i = 0, l = particles.length; i < l; i++) {
			var particle = particles[i];
			Smart.Physics.applyVelocity(particle, particle.velocity, deltaSeconds);
			Smart.Physics.applyFrictionToVelocity(particle.velocity, explosionOptions.friction, deltaSeconds);
			Smart.Physics.bounceOffWalls(particle, explosionOptions.radius, particle.velocity, levelBounds, 0);
			
			drawing
				.moveTo(particle.x, particle.y)
				.circle(particle.x, particle.y, explosionOptions.radius);
		}
		drawing.endPath(explosionOptions.style);
	}
});