import { Balance } from "@/XQuestGame/options/Balance.js";
import { Graphics } from "@/XQuestGraphics/EaselJS/Graphics.js";

export class BackgroundGraphics extends createjs.Shape {
  constructor() {
    super();
    const bounds = Balance.level.bounds;
    this._size = {
      width: bounds.x * 2 + bounds.width,
      height: bounds.y * 2 + bounds.height,
    };
    this._setupBackground();
    this._setupStars();

    this.cache(0, 0, this._size.width, this._size.height);
  }
  _setupBackground() {
    const g = this.graphics;
    const v = Graphics.background;
    const size = this._size;

    g.clear();

    g.beginFill(v.backgroundColor).drawRect(0, 0, size.width, size.height);
  }
  _setupStars() {
    const g = this.graphics;
    const v = Graphics.background;
    const size = this._size;
    const starColors = v.starColors;

    for (
      let colorIndex = 0, colorCount = starColors.length;
      colorIndex < colorCount;
      colorIndex++
    ) {
      const starColor = starColors[colorIndex % colorCount];

      g.beginStroke(starColor);

      let starCount = Math.floor(v.starCount / colorCount);
      while (starCount--) {
        const x = Math.floor(Math.random() * size.width);
        const y = Math.floor(Math.random() * size.height);
        g.moveTo(x, y).lineTo(x + 1, y + 1);
      }
    }

    g.endStroke();
  }
}
