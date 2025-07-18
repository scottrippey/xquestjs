import { Animation } from "./Smart.Animation.js";
import { Keyframes } from "./Smart.Keyframes.js";
import { Point } from "../Smart.Point.js";

/**
 * Animation Actions
 * These actions animate certain object properties that are used by EaselJS,
 * such as x, y, alpha, color, scaleX, scaleY, and rotation.
 */
Animation.implement({
  /**
   * Animates the `x` and `y` properties of the target.
   * @param {Point} target
   * @param {Function|Point[]|Point} keyframes
   * @returns {Animation} this
   */
  move(target, keyframes) {
    let interpolate = (position) => {
      interpolate =
        Keyframes.fromFunction(keyframes) ||
        Keyframes.fromPoints(keyframes) ||
        Keyframes.fromPoints([Point.clonePoint(target), keyframes]);
      return interpolate(position);
    };
    return this.frame(function _move_(animEvent) {
      const p = interpolate(animEvent.position);
      target.x = p.x;
      target.y = p.y;
    });
  },

  /**
   * Animates the `alpha` property of the target.
   * @param {Object} target
   * @param {Function|Number[]|Number} keyframes
   * @returns {Animation} this
   */
  fade(target, keyframes) {
    let interpolate = (position) => {
      interpolate =
        Keyframes.fromFunction(keyframes) ||
        Keyframes.fromNumbers(keyframes) ||
        Keyframes.fromNumbers([target.alpha !== undefined ? target.alpha : 1, keyframes]);
      return interpolate(position);
    };

    return this.frame(function _fade_(animEvent) {
      target.alpha = interpolate(animEvent.position);
    });
  },

  /**
   * Animates the `color` property of the target.
   * @param {Object} target
   * @param {Function|String[]|String} keyframes
   * @returns {Animation} this
   */
  color(target, keyframes) {
    let interpolate = (position) => {
      interpolate =
        Keyframes.fromFunction(keyframes) ||
        Keyframes.fromColors(keyframes) ||
        Keyframes.fromColors([target.color, keyframes]);
      return interpolate(position);
    };

    return this.frame(function _color_(animEvent) {
      target.color = interpolate(animEvent.position);
    });
  },

  /**
   * Animates the `scale` properties (scaleX, scaleY) of the target.
   * @param {Object} target
   * @param {Function|Number[]|Number} keyframes
   * @returns {Animation} this
   */
  scale(target, keyframes) {
    let interpolate = (position) => {
      interpolate =
        Keyframes.fromFunction(keyframes) ||
        Keyframes.fromNumbers(keyframes) ||
        Keyframes.fromNumbers([target.scaleX !== undefined ? target.scaleX : 1, keyframes]);
      return interpolate(position);
    };
    return this.frame(function _scale_(animEvent) {
      target.scaleX = target.scaleY = interpolate(animEvent.position);
    });
  },

  /**
   * Animates the `rotation` property of the target.
   * @param {Object} target
   * @param {Function|Number[]|Number} keyframes
   * @returns {Animation} this
   */
  rotate(target, keyframes) {
    let interpolate = function (position) {
      interpolate =
        Keyframes.fromFunction(keyframes) ||
        Keyframes.fromNumbers(keyframes) ||
        Keyframes.fromNumbers([target.rotation !== undefined ? target.rotation : 1, keyframes]);
      return interpolate(position);
    };

    return this.frame(function _rotate_(animEvent) {
      target.rotation = interpolate(animEvent.position);
    });
  },

  /**
   * Animates by calling `update` with the interpolated keyframe values.
   * @param {Function|Number[]} keyframes
   * @param {function(pct:Number)} update
   * @returns {Animation} this
   */
  tween(keyframes, update) {
    const interpolate = Keyframes.fromFunction(keyframes) || Keyframes.fromNumbers(keyframes);

    return this.frame(function _tween_(animEvent) {
      update(interpolate(animEvent.position));
    });
  },

  /**
   * Disposes the object once animations are finished
   * @param disposable - Any object -- must have a `dispose` method
   * @returns {Animation} this
   */
  queueDispose(disposable) {
    return this.queue(() => {
      disposable.dispose();
    });
  },
});
