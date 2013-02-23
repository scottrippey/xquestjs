var ParticleFactory = new Class({


	initialize: function(gfx) {
		this.gfx = gfx;

		this._particles = [];
	}

	,
	createParticle: function(particleOptions) {
		var particle = new createjs.Shape(), g = particle.graphics;
		particleOptions = particleOptions || {
			position: { x: 0, y: 0 }
			,style: {
				strokeWidth: 2
				,strokeColor: 'yellow'
				,fillColor: 'white'
			}
			,radius: 1
			,velocity: { x: 0, y: 0 }
			,friction: 0.1
			,getAnimationQueue: null
		};

		g.beginStyle(particleOptions.style);
		g.drawCircle(0, 0, particleOptions.radius);
		g.endStyle(particleOptions.style);

		if (particleOptions.getAnimationQueue) {
			particle.animationQueue = particleOptions.getAnimationQueue(particle);
			particle.animationQueue.queue(function() {
				particle.destroy();
			});
		}

		particle.x = particleOptions.position.x;
		particle.y = particleOptions.position.y;
		particle.velocity = particleOptions.velocity ? Object.clone(particleOptions.velocity) : null;
		particle.friction = particleOptions.friction || null;

		this._particles.push(particle);

		return particle;
	}
	,
	updateParticles: function(tickEvent) {
		var deltaSeconds = tickEvent.deltaSeconds;

		this._particles.each(function(particle) {
			if (particle.animationQueue) {
				particle.animationQueue.update(deltaSeconds);
			}
			if (particle.velocity) {
				Physics.applyVelocity(particle, particle.velocity, deltaSeconds);
				if (particle.friction) {
					Physics.applyFrictionToVelocity(particle.velocity, particle.friction, deltaSeconds);
				}
			}
		});
	}

});