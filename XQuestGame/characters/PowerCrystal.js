import { Physics } from "@/Tools/Smart.Physics.js";
import { Point } from "@/Tools/Smart.Point.js";
import { Balance } from "@/XQuestGame/options/Balance.js";

export class PowerCrystal {
  constructor(game) {
    const B = Balance.powerCrystals;
    this.game = game;
    this.game.addSceneItem(this);

    this.location = this.game.gfx.createPowerCrystalGraphic();
    this.radius = B.radius;

    this.turnSpeed = B.turnSpeed();
  }

  spawn(spawnInfo) {
    const B = Balance.powerCrystals;

    this.location.moveTo(spawnInfo.x, spawnInfo.y);
    this.velocity = { x: B.speed, y: 0 };
    Point.rotate(this.velocity, B.spawnAngle());
    if (spawnInfo.side === 2) {
      this.velocity.x *= -1;
    }
  }

  onMove(tickEvent) {
    const powerCrystal = this;

    // Turn:
    Point.rotate(powerCrystal.velocity, powerCrystal.turnSpeed * tickEvent.deltaSeconds);

    Physics.applyVelocity(powerCrystal.location, powerCrystal.velocity, tickEvent.deltaSeconds);
    Physics.bounceOffWalls(
      powerCrystal.location,
      powerCrystal.radius,
      powerCrystal.velocity,
      this.game.bounds,
    );
  }

  gatherPowerCrystal() {
    this.location.gatherPowerCrystal(this.game.gfx, this.game.player.location).queue(() => {
      this.game.removeSceneItem(this);
    });
  }

  clearPowerCrystal() {
    this.location.clearPowerCrystal(this.game.gfx).queue(() => {
      this.game.removeSceneItem(this);
    });
  }
}
