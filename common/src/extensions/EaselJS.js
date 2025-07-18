import { Disposable } from "@/common/src/Smart/Smart.Disposable.js";

assignProperties(createjs.Graphics.prototype, {
  beginStyle(styles) {
    const gfx = this;
    if (styles.fillColor) gfx.beginFill(styles.fillColor);
    if (styles.strokeColor) gfx.beginStroke(styles.strokeColor);

    if (styles.strokeWidth)
      gfx.setStrokeStyle(
        styles.strokeWidth,
        styles.strokeCaps,
        styles.strokeJoints,
        styles.strokeMiter,
      );

    return this;
  },
  endStyle(styles) {
    const gfx = this;
    if (styles.fillColor) gfx.endFill();
    if (styles.strokeColor) gfx.endStroke();

    return this;
  },
  drawPolygon(points) {
    const gfx = this;
    const startX = points[0][0];
    const startY = points[0][1];
    gfx.moveTo(startX, startY);
    for (let i = 1, l = points.length; i < l; i++) {
      const x = points[i][0];
      const y = points[i][1];
      gfx.lineTo(x, y);
    }
    gfx.lineTo(startX, startY);

    return this;
  },
});

assignProperties(createjs.DisplayObject.prototype, Disposable.prototype);
assignProperties(createjs.DisplayObject.prototype, {
  moveTo(x, y) {
    this.x = x;
    this.y = y;
  },
  scaleTo(x, y) {
    if (y === undefined) y = x;
    this.scaleX = x;
    this.scaleY = y;
  },
  toggleVisible(force) {
    if (force === undefined) force = !this.visible;
    this.visible = force;
  },
});

/**
 * Same as Object.assign but includes non-enumerable properties
 */
function assignProperties(ClassSuper, ClassSub) {
  Object.defineProperties(ClassSuper, Object.getOwnPropertyDescriptors(ClassSub));
}
