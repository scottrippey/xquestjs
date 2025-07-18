import { Animation } from "@/common/src/Smart/Animation/Smart.Animation.js";

export class PowerCrystalGraphic extends createjs.Shape {
  constructor() {
    super();
    this._setupGraphics();
  }

  _setupGraphics() {
    const G = Graphics.powerCrystals;
    this.graphics
      .clear()
      .beginStyle(G.style)
      .drawPolyStar(0, 0, G.radius, G.sides, G.pointSize, 0)
      .endStyle(G.style)

      .beginStyle(G.styleInner)
      .drawPolyStar(0, 0, G.radiusInner, G.sides, G.pointSize, 0)
      .endStyle(G.styleInner);
    this.rotation = 360 * Math.random();

    this.spinRate = G.spinRate;
  }

  onTick(tickEvent) {
    this.rotation += this.spinRate * tickEvent.deltaSeconds;
  }

  gatherPowerCrystal(gfx, playerLocation) {
    const powerCrystal = this;
    return gfx.addAnimation(
      new Animation()
        .duration(Graphics.powerCrystals.gatherDuration)
        .savePosition()

        .easeOut("quint")
        .move(powerCrystal, playerLocation)

        .restorePosition()
        .easeOut("quint")
        .scale(powerCrystal, [1, 2, 2.5, 2, 1, 0])

        .queueDispose(powerCrystal),
    );
  }

  clearPowerCrystal(gfx) {
    const powerCrystal = this;
    return gfx.addAnimation(
      new Animation()
        .duration(2)
        .easeIn()
        .scale(powerCrystal, 0)

        .queueDispose(powerCrystal),
    );
  }
}
