import { Balance } from "@/XQuestGame/options/Balance.js";
import { Point } from "@/common/src/Smart/Smart.Point.js";

export class BombGraphic extends createjs.Shape {
  constructor() {
    super();
    this.location = this;
    this.radius = Balance.player.radius;
  }
  _setupGraphics() {
    const G = Graphics.bombs;
    this.graphics.clear().beginStyle(G.style).drawCircle(0, 0, this.radius).endStyle(G.style);
  }
  onTick(tickEvent) {
    const B = Balance.bombs;
    const bounds = Balance.level.bounds;
    this.radius += B.speed * tickEvent.deltaSeconds;
    this.alpha = 1 - this.radius / bounds.totalWidth;
    if (this.alpha <= 0) {
      this.dispose();
    }
    this._setupGraphics();
  }
  getKickBack(enemy, distance) {
    const impactVector = Point.subtract(enemy.location, this.location);
    return Point.scaleVector(impactVector, Balance.bombs.speed * Balance.bombs.kickBack);
  }
}
