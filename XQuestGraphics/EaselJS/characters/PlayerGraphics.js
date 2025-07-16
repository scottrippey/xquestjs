EaselJSGraphics.PlayerGraphics = Smart.Class(new EaselJSGraphics.Drawing(), {
  drawStatic(drawing) {
    var G = Graphics.player;
    this.visibleRadius = G.radius;

    drawing.beginPath().circle(0, 0, G.radius).endPath(G.outerStrokeStyle);

    drawing
      .beginPath()
      .star(0, 0, G.innerRadius, G.innerStarPoints, G.innerStarSize, 0)
      .endPath(G.innerStyle);
  },
  drawEffects(drawing, tickEvent) {
    var G = Graphics.player;

    this.rotation += G.spinRate * tickEvent.deltaSeconds;
  },
  killPlayerGraphics(gfx, velocity) {
    var G = Graphics.player;
    this.toggleVisible(false);
    gfx.createExplosion(this, velocity, G.explosionOptions);
  },
  restorePlayerGraphics() {
    this.toggleVisible(true);
  },
});
