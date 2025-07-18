import { Balance } from "@/XQuestGame/options/Balance.js";
import { Physics } from "@/Tools/Smart.Physics.js";
import { Point } from "@/Tools/Smart.Point.js";
import { Animation } from "@/Tools/Animation/Smart.Animation.js";

export class Player {
  location = null;
  radius = null;

  constructor(game) {
    this.game = game;
    this.velocity = { x: 0, y: 0 };
    this.engaged = false;
    this.previousState = {};

    this._setupPlayerGraphics();
  }
  _setupPlayerGraphics() {
    this.playerGraphics = this.game.gfx.createPlayerGraphics();
    this.location = this.playerGraphics;
    this.radius = Balance.player.radius;
  }

  movePlayerTo(x, y) {
    this.playerGraphics.moveTo(x, y);
  }
  cancelVelocity() {
    this.velocity.x = 0;
    this.velocity.y = 0;
  }

  _handleInputs(tickEvent, inputState) {
    const previousState = this.previousState;

    if (!this.playerActive) return;

    this.previousState = inputState;

    if (inputState.accelerationX || inputState.accelerationY) {
      const acceleration = {
        x: inputState.accelerationX || 0,
        y: inputState.accelerationY || 0,
      };

      // Increase the sensitivity when decelerating
      const neutralizingFactor = 2.0;
      const isSameDirectionX = this.velocity.x <= 0 === inputState.accelerationX <= 0;
      const isSameDirectionY = this.velocity.y <= 0 === inputState.accelerationY <= 0;
      if (!isSameDirectionX) acceleration.x *= neutralizingFactor;
      if (!isSameDirectionY) acceleration.y *= neutralizingFactor;

      Physics.applyAcceleration(this.playerGraphics, acceleration, tickEvent.deltaSeconds);
      Physics.applyAccelerationToVelocity(this.velocity, acceleration);
    }

    this.engaged = inputState.engaged;

    if (inputState.primaryWeapon && !this.game.levelConfig.shootingDisabled) {
      const isFirstDown = previousState.primaryWeapon === false;
      if (isFirstDown) {
        this.primaryWeaponDownTime = tickEvent.runTime;

        if (this.game.activePowerups.sprayShot) {
          this.game.projectiles.addSprayShot(tickEvent);
        } else if (this.game.activePowerups.tripleShot) {
          this.game.projectiles.addTripleShot(Balance.powerups.tripleShot);
        } else {
          this.game.projectiles.addBullet();
        }
      }
    }

    if (inputState.primaryWeapon && !this.game.levelConfig.shootingDisabled) {
      let shotsPerSecond;
      if (this.game.activePowerups.rapidFire) {
        shotsPerSecond = Balance.powerups.rapidFire.shotsPerSecond;
      } else {
        shotsPerSecond = Balance.bullets.shotsPerSecond;
      }
      const period = 1000 / shotsPerSecond;
      if (!this.nextRapidFire) {
        this.nextRapidFire = tickEvent.runTime + period;
      } else if (this.nextRapidFire <= tickEvent.runTime) {
        this.nextRapidFire += period;
        if (this.game.activePowerups.sprayShot) {
          this.game.projectiles.addSprayShot(tickEvent);
        } else if (this.game.activePowerups.tripleShot) {
          this.game.projectiles.addTripleShot(Balance.powerups.tripleShot);
        } else {
          this.game.projectiles.addBullet();
        }
      }
    } else {
      this.nextRapidFire = null;
    }

    if (inputState.secondaryWeapon) {
      const isFirstDown = previousState.secondaryWeapon === false;
      if (isFirstDown) {
        this.game.projectiles.tryReleasingABomb();
        this.cancelVelocity();
      }
    }
  }

  onMove(tickEvent, inputState) {
    this._handleInputs(tickEvent, inputState);
    this._movePlayer(tickEvent);
  }
  _movePlayer(tickEvent) {
    Physics.applyVelocity(this.playerGraphics, this.velocity, tickEvent.deltaSeconds);

    if (!this.playerActive) return;

    //		if (this.inputResults.acceleration) {
    //			Physics.applyAcceleration(this.playerGraphics, this.inputResults.acceleration, tickEvent.deltaSeconds);
    //			Physics.applyAccelerationToVelocity(this.velocity, this.inputResults.acceleration);
    //		}
    if (!this.engaged) {
      Physics.applyFrictionToVelocity(
        this.velocity,
        Balance.player.looseFriction,
        tickEvent.deltaSeconds,
      );
    }

    const wallCollision = this.game.levelGraphics.levelCollision(this.location, this.radius);
    if (wallCollision) {
      if (wallCollision.insideGate) {
        if (wallCollision.insideGateDistance >= this.radius * 2) {
          this.cancelVelocity();
          this.game.levelUp();
        } else if (wallCollision.touchingGate) {
          Physics.bounceOffPoint(
            this.location,
            this.velocity,
            wallCollision.touchingGate,
            this.radius,
            Balance.player.bounceDampening,
          );
        }
      } else {
        if (this.game.activePowerups.invincible) {
          Physics.bounceOffWall(
            wallCollision,
            this.location,
            this.velocity,
            Balance.player.bounceDampening,
          );
        } else {
          this.game.killPlayer();
        }
      }
    }
  }

  onAct(tickEvent) {
    if (!this.playerActive) return;

    let killPlayer = false;
    this.game.enemyFactory.killEnemiesOnCollision(
      [this],
      this.radius,
      (enemy, player, ei, pi, distance) => {
        if (this.game.activePowerups.invincible) return;

        killPlayer = true;
      },
    );

    if (killPlayer) this.game.killPlayer();
  }

  killPlayer() {
    this.playerActive = false;
    this.playerGraphics.killPlayerGraphics(this.game.gfx, this.velocity);
  }

  showPlayer(show) {
    this.playerActive = show;
    if (show) {
      this.playerGraphics.restorePlayerGraphics();
      this.game.gfx
        .addAnimation(new Animation().duration(1).easeOut().scale(this.playerGraphics, [0, 1]))
        .update(0);
    } else {
      this.game.gfx.addAnimation(
        new Animation()
          .duration(0.5)
          .easeOut()
          .scale(this.playerGraphics, [1, 0])
          .queue(() => {
            this.playerGraphics.toggleVisible(false);
          }),
      );
    }
  }

  getKickBack(enemy, distance) {
    return Point.multiply(this.velocity, Balance.player.kickBack);
  }
}
