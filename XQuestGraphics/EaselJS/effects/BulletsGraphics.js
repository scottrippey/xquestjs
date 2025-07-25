import { Disposable } from "@/Tools/Smart.Disposable.js";
import { Point } from "@/Tools/Smart.Point.js";
import { Balance } from "@/XQuestGame/options/Balance.js";
import { Graphics } from "@/XQuestGraphics/EaselJS/Graphics.js";
import { EaselJSDrawing } from "@/XQuestGraphics/EaselJS/utils/EaselJSDrawing.js";

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

export class BulletsGraphics extends EaselJSDrawing {
  constructor() {
    super();
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
