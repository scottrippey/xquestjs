var Player = Class.create({
	location: null
	,
	initialize: function(game) {
		this.game = game;
		this.velocity = { x: 0, y: 0 };
		this.engaged = false;
		this.bullets = [];

		this._setupPlayerGraphics();
	}
	,
	_setupPlayerGraphics: function() {
		this.playerGraphics = this.game.gfx.createPlayerGraphics();
		this.location = this.playerGraphics;
		this.radius = Balance.player.radius;
	}
	,
	moveTo: function(x, y) {
		this.playerGraphics.moveTo(x, y);
	}
	,
	cancelVelocity: function() {
		this.velocity.x = 0;
		this.velocity.y = 0;
	}

	,
	onInput: function(tickEvent) {
		var results = this.inputResults = {
			acceleration: { x: 0, y: 0 }
			, engaged: this.engaged
			, primaryWeapon: 0
		};

		this.game.input.processInputs(function(inputItem) {
			switch (inputItem.inputType) {
				case 'accelerate':
					results.acceleration.x += inputItem.x;
					results.acceleration.y += inputItem.y;
					break;
				case 'engage':
					results.engaged = true;
					break;
				case 'disengage':
					results.engaged = false;
					break;
				case 'primaryWeapon':
					results.primaryWeapon += 1;
					break;
				case 'secondaryWeapon':
					results.secondaryWeapon = true;
					break;
				default:
					return false; // unhandled
			}
			return true;
		});

		this._analyzeInput();
	}
	,
	_analyzeInput: function() {
		if (this.inputResults.engaged !== this.engaged) {
			this.engaged = this.inputResults.engaged;
		}

		var i = this.inputResults.primaryWeapon;
		while (i--) {
			this._addBullet(i);
		}
	}
	,
	_addBullet: function(index) {
		var bulletGfx = this.game.gfx.createPlayerBullet();
		bulletGfx.moveTo(this.playerGraphics.x, this.playerGraphics.y);
		bulletGfx.velocity = {
			x: this.velocity.x * Balance.bullets.speed
			, y: this.velocity.y * Balance.bullets.speed
		};
		bulletGfx.location = bulletGfx;
		bulletGfx.radius = Balance.bullets.radius;
		this.bullets.push(bulletGfx);
	}

	,
	onMove: function(tickEvent) {
		this._movePlayer(tickEvent);
		this._moveBullets(tickEvent);
	}
	,
	_movePlayer: function(tickEvent) {

		Physics.applyVelocity(this.playerGraphics, this.velocity, tickEvent.deltaSeconds);

		if (!this.playerActive) return;

		if (this.inputResults.acceleration) {
			Physics.applyAcceleration(this.playerGraphics, this.inputResults.acceleration, tickEvent.deltaSeconds);
			Physics.applyAccelerationToVelocity(this.velocity, this.inputResults.acceleration);
		}
		if (!this.engaged) {
			Physics.applyFrictionToVelocity(this.velocity, Balance.player.looseFriction, tickEvent.deltaSeconds);
		}

		var wallCollision = this.game.levelGraphics.levelCollision(this.location, this.radius);
		if (wallCollision) {
			if (wallCollision.insideGate) {
				if (wallCollision.insideGateDistance >= this.radius * 2) {
					this.cancelVelocity();
					this.game.levelUp();
				} else if (wallCollision.touchingGate) {
					Physics.bounceOffPoint(this.location, this.velocity, wallCollision.touchingGate, this.radius, Balance.player.bounceDampening);
				}
			} else {
				if (this.game.powerups.bounceOffWalls) {
					Physics.bounceOffWall(wallCollision, this.location, this.velocity, Balance.player.bounceDampening);
				} else {
					this.game.killPlayer();
				}
			}
		}
	}
	,
	_moveBullets: function(tickEvent) {
		var bounds = Balance.level.bounds, i = this.bullets.length;
		while (i--) {
			var bulletGfx = this.bullets[i];
			Physics.applyVelocity(bulletGfx, bulletGfx.velocity, tickEvent.deltaSeconds);
			if (!Point.pointIsInBounds(bulletGfx, bounds)) {
				bulletGfx.destroyBullet();
				this.bullets.splice(i, 1);
			}
		}
	}


	,
	onAct: function(tickEvent) {
		if (this.bullets.length) {
			if (this.bullets.length >= 2) {
				Physics.sortByLocation(this.bullets);
			}
			this.game.enemies.killEnemiesOnCollision(this.bullets, Balance.bullets.radius, function(enemy, bullet, ei, bi, distance){
				this._destroyBullet(bullet, bi);
			}.bind(this));
		}
		// Temp: let the player destroy enemies:
		this.game.enemies.killEnemiesOnCollision([ this ], this.radius, null);

	}
	,
	_destroyBullet: function(bullet, bulletIndex) {

	}

	,
	killPlayerGraphics: function() {
		this.playerActive = false;
		this.playerGraphics.killPlayerGraphics();
	}

	,
	showPlayer: function(show) {
		this.playerActive = show;
		if (show) {
			this.playerGraphics.toggleVisible(true);
			this.game.gfx.addAnimation(new Animation()
				.duration(1).easeOut()
				.scale(this.playerGraphics, [0,1])
			);
		} else {
			this.game.gfx.addAnimation(new Animation()
				.duration(0.5).easeOut()
				.scale(this.playerGraphics, [1,0])
				.queue(function() {
					this.playerGraphics.toggleVisible(false);
				}.bind(this))
			);
		}
	}
});
