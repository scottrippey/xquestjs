import { EaselJSGraphics } from "@/XQuestGraphics/EaselJSGraphics.js";
import { Class } from "@/common/src/Smart/Smart.Class.js";

Balance.onUpdate((mode) => {
  _.merge(Graphics, {
    hudGraphics: {
      backgroundStyle: {
        fillStyle: "hsla(0, 100%, 100%, 0.1)",
      },
    },
  });
});

export const HudOverlay = Class(new EaselJSGraphics.Drawing(), {
  drawEffects(drawing) {
    const G = Graphics.hudGraphics;
    const bounds = Balance.level.bounds;

    drawing
      .beginPath()
      .rect(0, 0, bounds.visibleWidth, bounds.hudHeight)
      .endPath(G.backgroundStyle);
  },
});
