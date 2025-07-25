import { EaselJSDrawing } from "@/XQuestGraphics/EaselJS/utils/EaselJSDrawing.js";

export class BaseEnemyGraphics extends EaselJSDrawing {
  drawCircleCircle(drawing, G) {
    const outerRadius = G.outerRadius;
    const outerStyle = G.outerStyle;
    const innerRadius = G.innerRadius;
    const innerStyle = G.innerStyle;

    drawing
      .beginPath()
      .circle(0, 0, outerRadius)
      .endPath(outerStyle)

      .beginPath()
      .circle(0, 0, innerRadius)
      .endPath(innerStyle);
  }
  drawTriangleTriangle(drawing, G) {
    const outerTriangle = G.outerTriangle;
    const outerStyle = G.outerStyle;
    const innerTriangle = G.innerTriangle;
    const innerStyle = G.innerStyle;

    drawing
      .beginPath()
      .polygon(outerTriangle)
      .closePath()
      .endPath(outerStyle)

      .beginPath()
      .polygon(innerTriangle)
      .closePath()
      .endPath(innerStyle);
  }
  killEnemy(gfx, velocity) {
    const enemyGraphics = this;
    enemyGraphics.dispose();

    const explosionOptions = this.getExplosionOptions();
    gfx.createExplosion(enemyGraphics, velocity, explosionOptions);
  }
}
