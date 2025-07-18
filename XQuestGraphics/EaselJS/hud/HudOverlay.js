import { EaselJSDrawing } from "@/XQuestGraphics/EaselJS/utils/EaselJSDrawing.js";

Balance.onUpdate((mode) => {
  _.merge(Graphics, {
    hudGraphics: {
      backgroundStyle: {
        fillStyle: "hsla(0, 100%, 100%, 0.1)",
      },
    },
  });
});

export class HudOverlay extends EaselJSDrawing {
  drawEffects(drawing) {
    const G = Graphics.hudGraphics;
    const bounds = Balance.level.bounds;

    drawing
      .beginPath()
      .rect(0, 0, bounds.visibleWidth, bounds.hudHeight)
      .endPath(G.backgroundStyle);
  }
}
