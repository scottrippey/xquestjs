import { Class } from "@/Common/src/Smart/Smart.Class.js";
import { Drawing } from "@/Common/src/Smart/Smart.Drawing.js";
import { Interpolate } from "@/Common/src/Smart/Smart.Interpolate.js";

Balance.onUpdate((gameMode) => {
  const radius = Balance.enemies.mantis.radius;
  const red = "hsl(10, 100%, 50%)";
  const yellow = "hsl(60, 100%, 50%)";
  Graphics.merge({
    enemies: {
      mantis: {
        radius,
        star1: { radius, sides: 7, pointSize: 0.5, color: yellow },
        star2: { radius, sides: 7, pointSize: 0.7, angle: (360 / 7) * 0.5, color: red },
        pulse: 4,
        explosionOptions: {
          count: 20,
          speed: 500,
          style: {
            fillStyle: red,
          },
        },
      },
    },
  });
});

EaselJSGraphics.MantisGraphics = Class(new EaselJSGraphics.BaseEnemyGraphics(), {
  setup() {
    const G = Graphics.enemies.mantis;

    this.visibleRadius = G.radius;

    const star1 = Drawing.createStarPolygon(
      0,
      0,
      G.star1.radius,
      G.star1.sides,
      G.star1.pointSize,
      0,
    );
    const star2 = Drawing.createStarPolygon(
      0,
      0,
      G.star2.radius,
      G.star2.sides,
      G.star2.pointSize,
      G.star2.angle,
    );

    star2.push(star2.shift());

    this.getStar = Interpolate.arrays(star1, star2);
    this.getStarColor = Interpolate.colors(G.star1.color, G.star2.color);
    this.star1 = star1;
    this.star2 = star2;

    this.time = 0;
  },
  drawEffects(drawing, tickEvent) {
    const G = Graphics.enemies.mantis;
    this.time += tickEvent.deltaSeconds;
    const pulse = (Math.sin((this.time * Math.PI * 2) / G.pulse) + 1) / 2;

    this.starColor = this.getStarColor(pulse);

    drawing.beginPath().polygon(this.getStar(pulse)).closePath().fillStyle(this.starColor).fill();
  },
  getExplosionOptions() {
    const G = Graphics.enemies.mantis;
    const explosionOptions = _.defaults(
      { style: { fillStyle: this.starColor } },
      G.explosionOptions,
    );
    return explosionOptions;
  },
});
