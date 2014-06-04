var Player = Smart.Class({
	location: null
	, radius: null
	
	, initialize: function(game) {
		this.game = game;
		this.velocity = { x: 0, y: 0 };
		this.engaged = false;
		this.primaryWeaponDown = false;

		this._setupPlayerGraphics();
	}
	, _setupPlayerGraphics: function() {
		this.playerGraphics = this.game.gfx.createPlayerGraphics();
		this.location = this.playerGraphics;
		this.radius = Balance.player.radius;
	}
	
	, movePlayerTo: function(x, y) {
		this.playerGraphics.moveTo(x, y);
	}
	, cancelVelocity: function() {
		this.velocity.x = 0;
		this.velocity.y = 0;
	}

	, onInput: function(tickEvent) {

		this.game.input.processInputs(function(inputItem) {
			if (!this.playerActive) return true;

			switch (inputItem.inputType) {
				case 'accelerate':
					var acceleration = inputItem;
					Smart.Physics.applyAcceleration(this.playerGraphics, acceleration, tickEvent.deltaSeconds);
					Smart.Physics.applyAccelerationToVelocity(this.velocity, acceleration);
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
							if (this.game.activePowerups.tripleShot) {
								this.game.projectiles.addTripleShot(Balance.powerups.tripleShot);
							} else {
								this.game.projectiles.addBullet();
							}
						} else {
							// Up
							if (this.game.activePowerups.powerShot) {
								var powerShot = Balance.powerups.powerShot;
								var elapsed = tickEvent.runTime - this.primaryWeaponDownTime;
								if (elapsed >= powerShot.chargeDuration * 1000) {
									this.game.projectiles.addTripleShot(powerShot);
								}
							}
						}
					}
					break;
				case 'secondaryWeapon':
					this.game.projectiles.releaseABomb();
					break;
				default:
					return false; // unhandled
			}
			return true;
		}.bind(this));


		if (!this.playerActive) return;


		if (this.game.activePowerups.rapidFire) {
			if (this.primaryWeaponDown) {
				var period = 1000 / Balance.powerups.rapidFire.shotsPerSecond;
				if (!this.nextRapidFire) {
					this.nextRapidFire = tickEvent.runTime + period;
				} else if (this.nextRapidFire <= tickEvent.runTime) {
					this.nextRapidFire += period;
					if (this.game.activePowerups.tripleShot) {
						this.game.projectiles.addTripleShot(Balance.powerups.tripleShot);
					} else {
						this.game.projectiles.addBullet();
					}
				}
			} else {
				this.nextRapidFire = null;
			}
		}

	}

	, onMove: function(tickEvent) {
		this._movePlayer(tickEvent);
	}
	, _movePlayer: function(tickEvent) {

		Smart.Physics.applyVelocity(this.playerGraphics, this.velocity, tickEvent.deltaSeconds);

		if (!this.playerActive) return;

//		if (this.inputResults.acceleration) {
//			Physics.applyAcceleration(this.playerGraphics, this.inputResults.acceleration, tickEvent.deltaSeconds);
//			Physics.applyAccelerationToVelocity(this.velocity, this.inputResults.acceleration);
//		}
		if (!this.engaged) {
			Smart.Physics.applyFrictionToVelocity(this.velocity, Balance.player.looseFriction, tickEvent.deltaSeconds);
		}

		var wallCollision = this.game.levelGraphics.levelCollision(this.location, this.radius);
		if (wallCollision) {
			if (wallCollision.insideGate) {
				if (wallCollision.insideGateDistance >= this.radius * 2) {
					this.cancelVelocity();
					this.game.levelUp();
				} else if (wallCollision.touchingGate) {
					Smart.Physics.bounceOffPoint(this.location, this.velocity, wallCollision.touchingGate, this.radius, Balance.player.bounceDampening);
				}
			} else {
				if (this.game.activePowerups.invincible) {
					Smart.Physics.bounceOffWall(wallCollision, this.location, this.velocity, Balance.player.bounceDampening);
				} else {
					this.game.killPlayer();
				}
			}
		}
	}


	, onAct: function(tickEvent) {
		if (!this.playerActive) return;


		var killPlayer = false;
		this.game.enemies.killEnemiesOnCollision([ this ], this.radius, function(enemy, player, ei, pi, distance) {
			if (this.game.activePowerups.invincible) return;

			killPlayer = true;
		}.bind(this));

		if (killPlayer)
			this.game.killPlayer();

	}

	, killPlayer: function() {
		this.playerActive = false;
		this.playerGraphics.killPlayerGraphics(this.game.gfx, this.velocity);
	}

	, showPlayer: function(show) {
		this.playerActive = show;
		if (show) {
			this.playerGraphics.restorePlayerGraphics();
			this.game.gfx.addAnimation(new Smart.Animation()
				.duration(1).easeOut()
				.scale(this.playerGraphics, [0,1])
			).update(0);
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
