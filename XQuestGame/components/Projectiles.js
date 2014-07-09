XQuestGame.Projectiles = Smart.Class({
	initialize: function Projectiles(game) {
		this.game = game;
		this.game.addSceneItem(this);

		this.bullets = [];
		this.bomb = null;

	}
	, onMove: function(tickEvent) {
		this._moveBullets(tickEvent);
	}

	, onAct: function(tickEvent) {
		this._bulletsKillEnemies();
		this._bombsKillEnemies();
	}
	
	, addTripleShot: function(powerup) {
		var angle = powerup.angle;
		
		this.addBullet();
		this.addBullet(angle);
		this.addBullet(-angle);
	}
	, addAmbushShot: function() {
		var B = Balance.powerups.ambushShot;
		var shots = B.shots, speed = B.speed;
		var angle = 360 / shots;
		
		for (var i = 0; i < shots; i++) {
			this.addBullet(i * angle, speed);
		}
	}
	, addBullet: function(angle, speed) {
		var bulletGfx = this.game.gfx.createPlayerBullet();
		var player = this.game.player;
		bulletGfx.moveTo(player.location.x, player.location.y);
		var velocity;
		if (this.game.activePowerups.autoAim) {
			var autoAim = Balance.powerups.autoAim;
			var targetEnemy = this.game.enemies.findClosestEnemy(player.location);
			if (targetEnemy) {
				velocity = Smart.Physics.trajectory(player.location, targetEnemy.location, targetEnemy.velocity, autoAim.bulletSpeed);
			}
		}
		if (speed) {
			velocity = Smart.Point.fromAngle(angle, speed);
		}
		if (!velocity) {
			velocity = {
				x: player.velocity.x * Balance.bullets.speed
				, y: player.velocity.y * Balance.bullets.speed
			};
		}
		bulletGfx.velocity = velocity;
		if (angle) {
			Smart.Point.rotate(bulletGfx.velocity, angle);
		}
		bulletGfx.location = bulletGfx;
		bulletGfx.radius = Balance.bullets.radius;
		this.bullets.push(bulletGfx);
	}
	, _moveBullets: function(tickEvent) {
		var bounds = Balance.level.bounds, i = this.bullets.length;
		while (i--) {
			var bulletGfx = this.bullets[i];
			Smart.Physics.applyVelocity(bulletGfx, bulletGfx.velocity, tickEvent.deltaSeconds);
			
			if (this.game.activePowerups.powerShot) {
				Smart.Physics.bounceOffWalls(bulletGfx, bulletGfx.radius, bulletGfx.velocity, bounds, 0);
			}
			if (!Smart.Point.pointIsInBounds(bulletGfx, bounds)) {
				bulletGfx.dispose();
				this.bullets.splice(i, 1);
			}
		}
	}
	, _bulletsKillEnemies: function() {
		if (this.bullets.length) {
			if (this.bullets.length >= 2) {
				Smart.Physics.sortByLocation(this.bullets);
			}
			this.game.enemies.killEnemiesOnCollision(this.bullets, Balance.bullets.radius, function(enemy, bullet, ei, bi, distance){
				if (!this.game.activePowerups.powerShot)
					bullet.shouldDisappear = true;
			}.bind(this));

			// Remove bullets:
			var i = this.bullets.length;
			while (i--) {
				var bulletGfx = this.bullets[i];
				if (bulletGfx.shouldDisappear) {
					bulletGfx.dispose();
					this.bullets.splice(i, 1);
				}
			}
		}
		
	}
	

	
	, releaseABomb: function() {
		var canBomb = (this.game.stats.bombs > 0 && this.bomb === null);

		if (canBomb) {
			this.game.stats.bombs--;
			this._createBomb();
		}

		return canBomb;
	}
	, _createBomb: function() {
		var player = this.game.player;
		var bomb = this.game.gfx.createBombGraphic();
		this.bomb = bomb;
		bomb.onDispose(function(){
			this.bomb = null;
		}.bind(this));

		bomb.location.moveTo(player.location.x, player.location.y);
		return bomb;
	}
	, _bombsKillEnemies: function() {
		if (this.bomb) {
			this.game.enemies.killEnemiesOnCollision([ this.bomb ], this.bomb.radius);
		}
	}

});
