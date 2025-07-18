import { Graphics } from "@/XQuestGraphics/EaselJS/Graphics.js";
import { Color } from "@/common/src/Smart/Smart.Color.js";
import { BaseEnemyGraphics } from "./BaseEnemyGraphics.js";
import { Balance } from "@/XQuestGame/options/Balance.js";

Balance.onUpdate((mode) => {
  const green = "hsl(100, 100%, 50%)";
  const darkGreen = Color.darken(green, 30);
  const black = "black";

  _.merge(Graphics, {
    enemies: {
      slug: {
        radius: Balance.enemies.slug.radius + 1,
        circleCircle: {
          outerRadius: Balance.enemies.slug.radius + 1,
          outerStyle: { fillStyle: darkGreen },
          innerRadius: Balance.enemies.slug.radius * 0.7,
          innerStyle: { fillStyle: green, strokeStyle: black },
        },
        explosionOptions: {
          count: 20,
          speed: 300,
          style: {
            fillStyle: "hsl(100, 100%, 50%)",
          },
        },
      },
    },
  });
});

export class SlugGraphics extends BaseEnemyGraphics {
  constructor() {
    super();
    const G = Graphics.enemies.slug;
    this.visibleRadius = G.radius;
  }
  drawStatic(drawing, tickEvent) {
    const G = Graphics.enemies.slug;
    this.drawCircleCircle(drawing, G.circleCircle);
  }
  getExplosionOptions() {
    const G = Graphics.enemies.slug;
    return G.explosionOptions;
  }
}
