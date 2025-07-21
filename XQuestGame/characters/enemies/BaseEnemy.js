import { Animation } from "@/Tools/Animation/Smart.Animation.js";
import { Physics } from "@/Tools/Smart.Physics.js";
import { Balance } from "@/XQuestGame/options/Balance.js";

export class BaseEnemy {
  game = null;
  enemyGraphics = null;
  location = null;
  radius = null;
  velocity = null;

  /* @protected */
  constructor(game, enemyName, radius) {
    this.game = game;
    this.game.addSceneItem(this);
    this.enemyGraphics = this.game.gfx.createEnemyGraphics(enemyName);
    this.location = this.enemyGraphics;
    this.radius = radius;
  }

  /* @protected */
  applyVelocityAndBounce(tickEvent) {
    Physics.applyVelocity(this.location, this.velocity, tickEvent.deltaSeconds);
    Physics.bounceOffWalls(this.location, this.radius, this.velocity, this.game.levelConfig.bounds);
  }

  /* @protected */
  shouldChangeDirection(tickEvent, movementInterval) {
    const isFirstRun = this.nextChange === undefined;
    if (isFirstRun || this.nextChange <= tickEvent.runTime) {
      this.nextChange = tickEvent.runTime + movementInterval() * 1000;
      return !isFirstRun;
    }
    return false;
  }

  /** @public @overridable */
  takeDamage(hitPoints, kickBack) {
    // Apply the kickback:
    if (kickBack) {
      this.velocity.x += kickBack.x;
      this.velocity.y += kickBack.y;
    }

    // Apply the damage:
    if (hitPoints >= 1) {
      this.enemyGraphics.killEnemy(this.game.gfx, this.velocity);
      this.game.removeSceneItem(this);
    }
  }

  /* @public */
  clearEnemy() {
    this.game.gfx.addAnimation(
      new Animation()
        .duration(2)
        .easeIn()
        .scale(this.enemyGraphics, 0)
        .queue(() => {
          this.enemyGraphics.dispose();
          this.game.removeSceneItem(this);
        }),
    );
  }
}
