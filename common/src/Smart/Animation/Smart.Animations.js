import { Class } from "../Smart.Class.js";
import { Animation } from "./Smart.Animation.js";

export class Animations {
  /**
   * Adds or creates an animation to the list.
   *
   * @param {Animation} [animation]
   * @returns {Animation}
   */
  addAnimation(animation) {
    if (!animation) animation = new Animation();
    if (!this.animations) this.animations = [animation];
    else this.animations.push(animation);
    return animation;
  }

  /**
   * Updates all animations in the list.
   * Automatically removes finished animations.
   *
   * @param {Number} deltaSeconds
   */
  update(deltaSeconds) {
    if (!this.animations) return;
    let i = this.animations.length;
    while (i--) {
      const animEvent = this.animations[i].update(deltaSeconds);
      if (!animEvent.stillRunning) {
        // Remove the animation, by swapping in the last one:
        const lastAnimation = this.animations.pop();
        if (i < this.animations.length) this.animations[i] = lastAnimation;
      }
    }
  }
}
