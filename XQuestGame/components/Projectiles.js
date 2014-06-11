var Projectiles = Smart.Class({
	initialize: function Projectiles(game) {
		this.game = game;
		this.game.addGameItem(this);

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
	, addBullet: function(angle) {
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
			if (!Smart.Point.pointIsInBounds(bulletGfx, bounds)) {
				bulletGfx.destroyBullet();
				this.bullets.splice(i, 1);
			}
		}
	}
	, _destroyBullet: function(bullet, bulletIndex) {

	}
	, _bulletsKillEnemies: function() {
		if (this.bullets.length) {
			if (this.bullets.length >= 2) {
				Smart.Physics.sortByLocation(this.bullets);
			}
			this.game.enemies.killEnemiesOnCollision(this.bullets, Balance.bullets.radius, function(enemy, bullet, ei, bi, distance){
				this._destroyBullet(bullet, bi);
			}.bind(this));
		}
		
	}
	

	
	, releaseABomb: function() {
		var canBomb = (this.game.stats.bombs > 0 && this.bomb === null);

		if (canBomb) {
			this.game.stats.bombs--;
			this.bomb = this._createBomb();
		}

		return canBomb;
	}
	, _createBomb: function() {
		var player = this.game.player;
		var bomb = this.game.gfx.createBombGraphic();
		bomb.onDispose(function(){
			this.bomb = null;
		}.bind(this));
		bomb.location = bomb;
		bomb.location.moveTo(player.location.x, player.location.y);
		return bomb;
	}
	, _bombsKillEnemies: function() {
		if (this.bomb) {
			this.game.enemies.killEnemiesOnCollision([ this.bomb ], this.bomb.radius);
		}
	}

});
