XQuestGame.Projectiles = Smart.Class({
	initialize: function Projectiles(game) {
		this.game = game;
		this.game.addSceneItem(this);

		this.bulletsGraphics = this.game.gfx.createBulletsGraphics();
		this.bomb = null;
	},
	onMove(tickEvent) {
		this._moveBullets(tickEvent);
	},

	onAct(tickEvent) {
		this._bulletsKillEnemies();
		this._bombsKillEnemies();
	},

	addTripleShot(powerup) {
		var angle = powerup.angle;

		this.addBullet();
		this.addBullet(angle);
		this.addBullet(-angle);
	},
	addSprayShot(tickEvent) {
		var B = Balance.powerups.sprayShot;
		var shots = B.shots;
		var speed = B.speed;
		var spinSpeed = B.spinSpeed;
		var angle = 360 / shots;

		var angleOffset = spinSpeed * tickEvent.runTime / 1000;

		for (var i = 0; i < shots; i++) {
			this.addBullet(angleOffset + i * angle, speed);
		}
	},
	addBullet(angle, speed) {
		var B = Balance.bullets;
		var player = this.game.player;

		var velocity;
		if (this.game.activePowerups.autoAim) {
			var autoAim = Balance.powerups.autoAim;
			var targetEnemy = this.game.enemyFactory.findClosestEnemy(player.location);
			if (targetEnemy) {
				velocity = Smart.Physics.trajectory(player.location, targetEnemy.location, targetEnemy.velocity, autoAim.bulletSpeed);
			}
		}
		if (speed) {
			velocity = Smart.Point.fromAngle(angle, speed);
			angle = 0;
		}
		if (!velocity) {
			if (player.velocity.x === 0 && player.velocity.y === 0) {
				return;
			}
			velocity = {
				x: player.velocity.x * B.speed,
				y: player.velocity.y * B.speed
			};
		}

		var bulletGfx = this.bulletsGraphics.addBullet();
		bulletGfx.moveTo(player.location.x, player.location.y);

		bulletGfx.velocity = velocity;
		if (angle) {
			Smart.Point.rotate(bulletGfx.velocity, angle);
		}
		bulletGfx.location = bulletGfx;
		bulletGfx.radius = B.radius;
	},
	_moveBullets(tickEvent) {
		var bounds = Balance.level.bounds;
		var bullets = this.bulletsGraphics.bullets;
		var i = bullets.length;
		while (i--) {
			var bulletGfx = bullets[i];
			Smart.Physics.applyVelocity(bulletGfx, bulletGfx.velocity, tickEvent.deltaSeconds);

			if (this.game.activePowerups.powerShot) {
				Smart.Physics.bounceOffWalls(bulletGfx, bulletGfx.radius, bulletGfx.velocity, bounds, 0);
			}
			if (!Smart.Point.pointIsInBounds(bulletGfx, bounds)) {
				bullets.splice(i, 1);
			}
		}
	},
	_bulletsKillEnemies() {
		var bullets = this.bulletsGraphics.bullets;
		if (bullets.length) {
			if (bullets.length >= 2) {
				Smart.Physics.sortByLocation(bullets);
			}
			this.game.enemyFactory.killEnemiesOnCollision(bullets, Balance.bullets.radius, (enemy, bullet, ei, bi, distance) => {
				if (!this.game.activePowerups.powerShot)
					bullet.shouldDisappear = true;
			});

			// Remove bullets:
			var i = bullets.length;
			while (i--) {
				var bulletGfx = bullets[i];
				if (bulletGfx.shouldDisappear) {
					bullets.splice(i, 1);
				}
			}
		}

	},
	clearBullets() {
		this.game.gfx.addAnimation()
			.duration(1)
			.fade(this.bulletsGraphics, 0)
			.queue(() => {
				this.bulletsGraphics.alpha = 1;
				this.bulletsGraphics.bullets.length = 0;
			});
	},


	tryReleasingABomb() {
		var canBomb = (this.game.stats.bombs > 0 && this.bomb === null && !this.game.levelConfig.bombsDisabled);

		if (canBomb) {
			this.game.stats.bombs--;
			this._createBomb();
		}

		return canBomb;
	},
	_createBomb() {
		var player = this.game.player;
		var bomb = this.game.gfx.createBombGraphic();
		this.bomb = bomb;
		bomb.onDispose(() => {
			this.bomb = null;
		});

		bomb.location.moveTo(player.location.x, player.location.y);
		return bomb;
	},
	_bombsKillEnemies() {
		if (this.bomb) {
			this.game.enemyFactory.killEnemiesOnCollision([ this.bomb ], this.bomb.radius);
		}
	}

});
