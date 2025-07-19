import { BaseEnemyGraphics } from "./BaseEnemyGraphics.js";
import { Drawing } from "@/Tools/Smart.Drawing.js";
import { Balance } from "@/XQuestGame/options/Balance.js";
import { Graphics } from "@/XQuestGraphics/EaselJS/Graphics.js";

Balance.onUpdate((mode) => {
  const outerRadius = Balance.enemies.locust.radius;
  const outerOffset = 0;
  const innerRadius = (outerRadius * 6) / 11;
  const innerOffset = (outerRadius * 3) / 11;
  const orange = "hsl(40, 100%, 50%)";
  const red = "hsl(0, 100%, 30%)";

  _.merge(Graphics, {
    enemies: {
      locust: {
        visibleRadius: Balance.enemies.locust.radius + 1,
        triangleTriangle: {
          outerTriangle: Drawing.polygonFromAngles(0, outerOffset, outerRadius, [0, 130, 230]),
          outerStyle: { fillStyle: orange },

          innerTriangle: Drawing.polygonFromAngles(0, innerOffset, innerRadius, [0, 130, 230]),
          innerStyle: { fillStyle: red, strokeStyle: "black" },
        },
        explosionOptions: {
          count: 20,
          speed: 500,
          style: {
            fillStyle: "hsl(40, 100%, 50%)",
          },
        },
      },
    },
  });
});

export class LocustGraphics extends BaseEnemyGraphics {
  constructor() {
    super();
    const G = Graphics.enemies.locust;
    this.visibleRadius = G.visibleRadius;
  }
  drawEffects(drawing) {
    const G = Graphics.enemies.locust;
    this.drawTriangleTriangle(drawing, G.triangleTriangle);
  }
  getExplosionOptions() {
    const G = Graphics.enemies.locust;
    return G.explosionOptions;
  }
}
