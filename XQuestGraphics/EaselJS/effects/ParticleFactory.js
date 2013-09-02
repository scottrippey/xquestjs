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
			,getAnimation: null
		};

		g.beginStyle(particleOptions.style);
		g.drawCircle(0, 0, particleOptions.radius);
		g.endStyle(particleOptions.style);

		if (particleOptions.getAnimation) {
			particle.animation = particleOptions.getAnimation(particle);
			particle.animation.queue(function() {
				particle.destroy();
			});
		}

		particle.x = particleOptions.position.x;
		particle.y = particleOptions.position.y;
		particle.velocity = particleOptions.velocity ? _.clone(particleOptions.velocity) : null;
		particle.friction = particleOptions.friction || null;

		this._particles.push(particle);

		return particle;
	}
	,
	updateParticles: function(tickEvent) {
		var deltaSeconds = tickEvent.deltaSeconds;

		this._particles.each(function(particle) {
			if (particle.animation) {
				particle.animation.update(deltaSeconds);
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
