import { Animation } from "@/common/src/Smart/Animation/Smart.Animation.js";
import { DrawingContext, DrawingQueue } from "@/common/src/Smart/Smart.Drawing.js";

export class EaselJSDrawing extends createjs.DisplayObject {
  /**
   * When overridden, creates a DrawingQueue to create a static drawing.
   * @function
   * @param {DrawingQueue} drawing
   */
  drawStatic(drawing) {}

  /**
   * When overridden, this is called each tick, with a DrawingContext and a tickEvent.
   * @function
   * @param {DrawingContext} drawing
   * @param {TickEvent} tickEvent
   */
  drawEffects(drawing, tickEvent) {}

  drawingContext = new DrawingContext(null);

  constructor() {
    super();
    if (this.drawStatic) {
      this.drawingQueue = new DrawingQueue();
      this.drawStatic(this.drawingQueue);
    }
  }

  onTick(tickEvent) {
    this.tickEvent = tickEvent;
  }
  draw(ctx, ignoreCache) {
    // Render if cached:
    const DisplayObject_handled = super.draw(ctx, ignoreCache);
    if (!DisplayObject_handled && this.drawingQueue) {
      this.drawingQueue.draw(ctx);
    }
    if (this._anim) {
      this._anim.update(this.tickEvent.deltaSeconds);
    }
    if (this.drawEffects && !ignoreCache && this.tickEvent) {
      this.drawingContext.setContext(ctx);
      this.drawEffects(this.drawingContext, this.tickEvent);
    }

    return true;
  }

  addAnimation() {
    const anim = new Animation();
    if (!this._anim) {
      this._anim = anim;
    } else {
      // TODO: What if we need multiple animations?
      throw "Multiple animations not yet supported";
    }
    return anim;
  }
}
