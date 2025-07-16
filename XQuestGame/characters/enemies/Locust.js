import { Class } from "../../../../common/src/Smart/Smart.Class.js";
import { Point } from "../../../../common/src/Smart/Smart.Point.js";
import { Physics } from "../../../../common/src/Smart/Smart.Physics.js";

XQuestGame.Locust = Class(new XQuestGame.BaseEnemy(), {
  initialize: function Locust(game) {
    const B = Balance.enemies.locust;
    this.setupBaseEnemyGraphics(game, "Locust", B.radius);
  },

  spawn(spawnInfo) {
    const B = Balance.enemies.locust;
    this.location.moveTo(spawnInfo.x, spawnInfo.y);
    this.velocity = Point.fromAngle((spawnInfo.side === 2 ? 180 : 0) + _.random(-20, 20), B.speed);
    this._changeTurnSpeed();
  },

  _changeTurnSpeed() {
    const B = Balance.enemies.locust;
    this.turnSpeed = B.turnSpeed();
  },

  onMove(tickEvent) {
    const rotation = tickEvent.deltaSeconds * this.turnSpeed;
    Point.rotate(this.velocity, rotation);

    Physics.applyVelocity(this.location, this.velocity, tickEvent.deltaSeconds);
    Physics.bounceOffWalls(this.location, this.radius, this.velocity, Balance.level.bounds);
  },

  onAct(tickEvent) {
    const B = Balance.enemies.locust;
    if (this.shouldChangeDirection(tickEvent, B.movementInterval)) {
      this._changeTurnSpeed();
    }

    this.enemyGraphics.rotation = Point.angleFromVector(this.velocity);
  },
});
