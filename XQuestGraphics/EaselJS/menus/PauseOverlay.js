import { EaselJSDrawing } from "@/XQuestGraphics/EaselJS/utils/EaselJSDrawing.js";

Balance.onUpdate((gameMode) => {
  Graphics.merge({
    pauseOverlay: {
      style: {
        fillStyle: "hsla(0, 0%, 0%, 0.8)",
      },
      fadeInDuration: 1,
    },
  });
});

export class PauseOverlay extends EaselJSDrawing {
  constructor(gfx) {
    super();
    this.gfx = gfx;
  }
  drawStatic(drawing) {
    const bounds = Balance.level.bounds;
    const G = Graphics.pauseOverlay;
    drawing.beginPath().rect(0, 0, bounds.visibleWidth, bounds.visibleHeight).endPath(G.style);
  }
  showPauseOverlay() {
    const G = Graphics.pauseOverlay;
    this.gfx.addAnimation().duration(G.fadeInDuration).easeOut().fade(this, [0, 1]);
  }
}
