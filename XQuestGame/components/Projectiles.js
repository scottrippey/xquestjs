import { Class } from "@/common/src/Smart/Smart.Class.js";
import { Physics } from "@/common/src/Smart/Smart.Physics.js";
import { Point } from "@/common/src/Smart/Smart.Point.js";

XQuestGame.Projectiles = Class({
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
    const angle = powerup.angle;

    this.addBullet();
    this.addBullet(angle);
    this.addBullet(-angle);
  },
  addSprayShot(tickEvent) {
    const B = Balance.powerups.sprayShot;
    const shots = B.shots;
    const speed = B.speed;
    const spinSpeed = B.spinSpeed;
    const angle = 360 / shots;

    const angleOffset = (spinSpeed * tickEvent.runTime) / 1000;

    for (let i = 0; i < shots; i++) {
      this.addBullet(angleOffset + i * angle, speed);
    }
  },
  addBullet(angle, speed) {
    const B = Balance.bullets;
    const player = this.game.player;

    let velocity;
    if (this.game.activePowerups.autoAim) {
      const autoAim = Balance.powerups.autoAim;
      const targetEnemy = this.game.enemyFactory.findClosestEnemy(player.location);
      if (targetEnemy) {
        velocity = Physics.trajectory(
          player.location,
          targetEnemy.location,
          targetEnemy.velocity,
          autoAim.bulletSpeed,
        );
      }
    }
    if (speed) {
      velocity = Point.fromAngle(angle, speed);
      angle = 0;
    }
    if (!velocity) {
      if (player.velocity.x === 0 && player.velocity.y === 0) {
        return;
      }
      velocity = {
        x: player.velocity.x * B.speed,
        y: player.velocity.y * B.speed,
      };
    }

    const bulletGfx = this.bulletsGraphics.addBullet();
    bulletGfx.moveTo(player.location.x, player.location.y);

    bulletGfx.velocity = velocity;
    if (angle) {
      Point.rotate(bulletGfx.velocity, angle);
    }
    bulletGfx.location = bulletGfx;
    bulletGfx.radius = B.radius;
  },
  _moveBullets(tickEvent) {
    const bounds = Balance.level.bounds;
    const bullets = this.bulletsGraphics.bullets;
    let i = bullets.length;
    while (i--) {
      const bulletGfx = bullets[i];
      Physics.applyVelocity(bulletGfx, bulletGfx.velocity, tickEvent.deltaSeconds);

      if (this.game.activePowerups.powerShot) {
        Physics.bounceOffWalls(bulletGfx, bulletGfx.radius, bulletGfx.velocity, bounds, 0);
      }
      if (!Point.pointIsInBounds(bulletGfx, bounds)) {
        bullets.splice(i, 1);
      }
    }
  },
  _bulletsKillEnemies() {
    const bullets = this.bulletsGraphics.bullets;
    if (bullets.length) {
      if (bullets.length >= 2) {
        Physics.sortByLocation(bullets);
      }
      this.game.enemyFactory.killEnemiesOnCollision(
        bullets,
        Balance.bullets.radius,
        (enemy, bullet, ei, bi, distance) => {
          if (!this.game.activePowerups.powerShot) bullet.shouldDisappear = true;
        },
      );

      // Remove bullets:
      let i = bullets.length;
      while (i--) {
        const bulletGfx = bullets[i];
        if (bulletGfx.shouldDisappear) {
          bullets.splice(i, 1);
        }
      }
    }
  },
  clearBullets() {
    this.game.gfx
      .addAnimation()
      .duration(1)
      .fade(this.bulletsGraphics, 0)
      .queue(() => {
        this.bulletsGraphics.alpha = 1;
        this.bulletsGraphics.bullets.length = 0;
      });
  },

  tryReleasingABomb() {
    const canBomb =
      this.game.stats.bombs > 0 && this.bomb === null && !this.game.levelConfig.bombsDisabled;

    if (canBomb) {
      this.game.stats.bombs--;
      this._createBomb();
    }

    return canBomb;
  },
  _createBomb() {
    const player = this.game.player;
    const bomb = this.game.gfx.createBombGraphic();
    this.bomb = bomb;
    bomb.onDispose(() => {
      this.bomb = null;
    });

    bomb.location.moveTo(player.location.x, player.location.y);
    return bomb;
  },
  _bombsKillEnemies() {
    if (this.bomb) {
      this.game.enemyFactory.killEnemiesOnCollision([this.bomb], this.bomb.radius);
    }
  },
});
