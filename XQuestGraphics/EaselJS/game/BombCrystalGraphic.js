import { Animation } from "@/Tools/Animation/Smart.Animation.js";
import { Graphics } from "@/XQuestGraphics/EaselJS/Graphics.js";

export class BombCrystalGraphic extends createjs.Shape {
  constructor() {
    super();
    this._setupGraphics();
  }
  _setupGraphics() {
    const G = Graphics.bombCrystals;

    this.visibleRadius = G.radius;

    this.graphics
      .clear()
      .beginStyle(G.style)
      .drawPolyStar(0, 0, G.radius, G.sides, G.pointSize, 0)
      .closePath()
      .endStyle(G.style)

      .beginStyle(G.styleInner)
      .drawPolyStar(0, 0, G.radiusInner, G.sides, G.pointSize, 0)
      .closePath()
      .endStyle(G.styleInner);
    this.rotation = 360 * Math.random();

    this.spinRate = G.spinRate;
  }
  onTick(tickEvent) {
    this.rotation += this.spinRate * tickEvent.deltaSeconds;
  }
  gatherBombCrystal(gfx, playerLocation) {
    const bombCrystal = this;
    return gfx.addAnimation(
      new Animation()
        .duration(Graphics.bombCrystals.gatherDuration)
        .savePosition()

        .easeOut("quint")
        .move(bombCrystal, playerLocation)

        .restorePosition()
        .easeOut("quint")
        .scale(bombCrystal, [1, 2, 2.5, 2, 1, 0])

        .queueDispose(bombCrystal),
    );
  }
}
