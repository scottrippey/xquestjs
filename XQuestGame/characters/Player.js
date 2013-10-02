var Player = Smart.Class({
	location: null
	, radius: null
	,
	initialize: function(game) {
		this.game = game;
		this.velocity = { x: 0, y: 0 };
		this.engaged = false;
		this.bullets = [];
		this.primaryWeaponDown = false;

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
		if (!this.playerActive) return;

		this.game.input.processInputs(function(inputItem) {
			switch (inputItem.inputType) {
				case 'accelerate':
					var acceleration = inputItem;
					Physics.applyAcceleration(this.playerGraphics, acceleration, tickEvent.deltaSeconds);
					Physics.applyAccelerationToVelocity(this.velocity, acceleration);
					break;
				case 'engage':
					this.engaged = true;
					break;
				case 'disengage':
					this.engaged = false;
					break;
				case 'primaryWeapon':
					if (this.primaryWeaponDown !== inputItem.down) {
						this.primaryWeaponDown = inputItem.down;

						if (this.primaryWeaponDown) {
							// Down
							this.primaryWeaponDownTime = tickEvent.runTime;
							if (this.game.powerups.tripleShot) {
								this._tripleShot(Balance.powerups.tripleShot);
							} else {
								this._addBullet();
							}
						} else {
							// Up
							if (this.game.powerups.powerShot) {
								var powerShot = Balance.powerups.powerShot;
								var elapsed = tickEvent.runTime - this.primaryWeaponDownTime;
								if (elapsed >= powerShot.chargeDuration * 1000) {
									this._tripleShot(powerShot);
								}
							}
						}
					}
					break;
				default:
					return false; // unhandled
			}
			return true;
		}.bind(this));



		if (this.game.powerups.rapidFire) {
			if (this.primaryWeaponDown) {
				var period = 1000 / Balance.powerups.rapidFire.shotsPerSecond;
				if (!this.nextRapidFire) {
					this.nextRapidFire = tickEvent.runTime + period;
				} else if (this.nextRapidFire <= tickEvent.runTime) {
					this.nextRapidFire += period;
					if (this.game.powerups.tripleShot) {
						this._tripleShot(Balance.powerups.tripleShot);
					} else {
						this._addBullet();
					}
				}
			} else {
				this.nextRapidFire = null;
			}
		}

	}
	,
	_tripleShot: function(powerup) {
		var playerSpeed = Point.hypotenuse(this.velocity);
		var angle = powerup.angle * powerup.focus / playerSpeed;

		this._addBullet();
		this._addBullet(angle);
		this._addBullet(-angle);
	}
	,
	_addBullet: function(angle) {
		var bulletGfx = this.game.gfx.createPlayerBullet();
		bulletGfx.moveTo(this.playerGraphics.x, this.playerGraphics.y);
		var velocity;
		if (this.game.powerups.autoAim) {
			var autoAim = Balance.powerups.autoAim;
			var targetEnemy = this.game.enemies.findClosestEnemy(this.location);
			if (targetEnemy) {
				velocity = Physics.trajectory(this.location, targetEnemy.location, targetEnemy.velocity, autoAim.bulletSpeed);
			}
		}
		if (!velocity) {
			velocity = {
				x: this.velocity.x * Balance.bullets.speed
				, y: this.velocity.y * Balance.bullets.speed
			};
		}
		bulletGfx.velocity = velocity;
		if (angle) {
			Point.rotate(bulletGfx.velocity, angle);
		}
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

//		if (this.inputResults.acceleration) {
//			Physics.applyAcceleration(this.playerGraphics, this.inputResults.acceleration, tickEvent.deltaSeconds);
//			Physics.applyAccelerationToVelocity(this.velocity, this.inputResults.acceleration);
//		}
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
		if (!this.playerActive) return;

		if (this.bullets.length) {
			if (this.bullets.length >= 2) {
				Physics.sortByLocation(this.bullets);
			}
			this.game.enemies.killEnemiesOnCollision(this.bullets, Balance.bullets.radius, function(enemy, bullet, ei, bi, distance){
				this._destroyBullet(bullet, bi);
			}.bind(this));
		}

		this.game.enemies.killEnemiesOnCollision([ this ], this.radius, function(enemy, player, ei, pi, distance) {
			if (this.game.powerups.invincible) return;

			this.game.killPlayer();
		}.bind(this));

	}
	,
	_destroyBullet: function(bullet, bulletIndex) {

	}

	,
	killPlayer: function() {
		this.playerActive = false;
		this.playerGraphics.killPlayerGraphics(this.game.gfx, this.velocity);
	}

	,
	showPlayer: function(show) {
		this.playerActive = show;
		if (show) {
			this.playerGraphics.restorePlayerGraphics();
			this.game.gfx.addAnimation(new Smart.Animation()
				.duration(1).easeOut()
				.scale(this.playerGraphics, [0,1])
			);
		} else {
			this.game.gfx.addAnimation(new Smart.Animation()
				.duration(0.5).easeOut()
				.scale(this.playerGraphics, [1,0])
				.queue(function() {
					this.playerGraphics.toggleVisible(false);
				}.bind(this))
			);
		}
	}
});
