import { BaseEnemy } from "../enemies/BaseEnemy.js";
import { Point } from "@/Tools/Smart.Point.js";
import { Balance } from "@/XQuestGame/options/Balance.js";

export class Mantis extends BaseEnemy {
  constructor(game) {
    super();
    const B = Balance.enemies.mantis;
    this.setupBaseEnemyGraphics(game, "Mantis", B.radius);
  }

  spawn(spawnInfo) {
    this.location.moveTo(spawnInfo.x, spawnInfo.y);
    this._changeDirection();
  }

  onMove(tickEvent) {
    this.applyVelocityAndBounce(tickEvent);
  }

  onAct(tickEvent) {
    const B = Balance.enemies.mantis;
    if (this.shouldChangeDirection(tickEvent, B.movementInterval)) {
      this._changeDirection();
    }
  }

  _changeDirection() {
    const B = Balance.enemies.mantis;
    this.velocity = Point.fromAngle(Math.random() * 360, B.speed);
  }
}
