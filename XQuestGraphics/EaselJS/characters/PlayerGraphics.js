import { Class } from "common/src/Smart/Smart.Class";

EaselJSGraphics.PlayerGraphics = Class(new EaselJSGraphics.Drawing(), {
  drawStatic(drawing) {
    const G = Graphics.player;
    this.visibleRadius = G.radius;

    drawing.beginPath().circle(0, 0, G.radius).endPath(G.outerStrokeStyle);

    drawing
      .beginPath()
      .star(0, 0, G.innerRadius, G.innerStarPoints, G.innerStarSize, 0)
      .endPath(G.innerStyle);
  },
  drawEffects(drawing, tickEvent) {
    const G = Graphics.player;

    this.rotation += G.spinRate * tickEvent.deltaSeconds;
  },
  killPlayerGraphics(gfx, velocity) {
    const G = Graphics.player;
    this.toggleVisible(false);
    gfx.createExplosion(this, velocity, G.explosionOptions);
  },
  restorePlayerGraphics() {
    this.toggleVisible(true);
  },
});
