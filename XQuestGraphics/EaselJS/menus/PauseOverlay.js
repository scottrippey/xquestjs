import { Class } from "@/common/src/Smart/Smart.Class.js";
import { Drawing } from "../utils/Drawing.js";

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

export const PauseOverlay = Class(new Drawing(), {
  setup(gfx) {
    this.gfx = gfx;
  },
  drawStatic(drawing) {
    const bounds = Balance.level.bounds;
    const G = Graphics.pauseOverlay;
    drawing.beginPath().rect(0, 0, bounds.visibleWidth, bounds.visibleHeight).endPath(G.style);
  },
  showPauseOverlay() {
    const G = Graphics.pauseOverlay;
    this.gfx.addAnimation().duration(G.fadeInDuration).easeOut().fade(this, [0, 1]);
  },
});
