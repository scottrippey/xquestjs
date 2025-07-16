import { Class } from "../../../../common/src/Smart/Smart.Class.js";
import { Animation } from "../../../../common/src/Smart/Animation/Smart.Animation.js";

EaselJSGraphics.CrystalGraphic = Class(new createjs.Shape(), {
  initialize: function CrystalGraphic() {
    this._setupCrystalGraphic();
  },

  _setupCrystalGraphic() {
    const G = Graphics.crystals;
    this.visibleRadius = G.radius;

    this.graphics
      .clear()
      .beginStyle(G.style)
      .drawPolyStar(0, 0, G.radius, G.sides, G.pointSize, 0)
      .endStyle(G.style);
    this.rotation = 360 * Math.random();

    this.spinRate = G.spinRate;
  },

  onTick(tickEvent) {
    this.rotation += this.spinRate * tickEvent.deltaSeconds;
  },

  gatherCrystal(gfx, playerLocation) {
    const crystal = this;
    gfx.addAnimation(
      new Animation()
        .duration(Graphics.crystals.gatherDuration)

        .savePosition()
        .easeIn("quint")
        .move(crystal, playerLocation)

        .restorePosition()
        .scale(crystal, [0.9, 0.3])

        .restorePosition()
        .easeOut("quint")

        .tween([crystal.spinRate, Graphics.crystals.spinRateGathered], (s) => {
          crystal.spinRate = s;
        })

        .queueDispose(crystal),
    );
  },
});
