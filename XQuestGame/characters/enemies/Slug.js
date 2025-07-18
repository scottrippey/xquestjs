import { Point } from "@/common/src/Smart/Smart.Point.js";
import { BaseEnemy } from "./BaseEnemy.js";
import { Balance } from "@/XQuestGame/options/Balance.js";

export class Slug extends BaseEnemy {
  constructor(game) {
    super();
    const B = Balance.enemies.slug;
    this.setupBaseEnemyGraphics(game, "Slug", B.radius);
  }

  spawn(spawnInfo) {
    this.location.moveTo(spawnInfo.x, spawnInfo.y);
    this._changeDirection();
  }

  onMove(tickEvent) {
    this.applyVelocityAndBounce(tickEvent);
  }

  onAct(tickEvent) {
    const B = Balance.enemies.slug;
    if (this.shouldChangeDirection(tickEvent, B.movementInterval)) {
      this._changeDirection();
    }
  }

  _changeDirection() {
    const B = Balance.enemies.slug;
    this.velocity = Point.fromAngle(Math.random() * 360, B.speed);
  }
}
