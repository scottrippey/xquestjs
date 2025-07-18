import { Disposable } from "@/common/src/Smart/Smart.Disposable.js";
import { Point } from "@/common/src/Smart/Smart.Point.js";
import { Drawing } from "../utils/Drawing.js";

Balance.onUpdate((gameMode) => {
  Graphics.merge({
    bullets: {
      radius: Balance.bullets.radius,
      style: {
        fillStyle: "white",
      },
    },
  });
});

export class BulletsGraphics extends Drawing {
  setup() {
    this.bullets = [];
  }
  addBullet() {
    const bullet = new Bullet();
    this.bullets.push(bullet);
    bullet.onDispose(() => {
      const index = this.bullets.indexOf(bullet);
      this.bullets.splice(index, 1);
    });
    return bullet;
  }
  drawEffects(drawing) {
    const G = Graphics.bullets;

    drawing.beginPath();

    let i = this.bullets.length;
    while (i--) {
      const bullet = this.bullets[i];
      drawing.moveTo(bullet.x + G.radius, bullet.y).circle(bullet.x, bullet.y, G.radius);
    }
    drawing.endPath(G.style);
  }
}

export class Bullet extends Disposable {
  moveTo(x, y) {
    this.x = x;
    this.y = y;
  }
  getKickBack(enemy, distance) {
    const B = Balance.bullets;
    return Point.multiply(this.velocity, B.kickBack);
  }
}
