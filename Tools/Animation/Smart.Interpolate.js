import { Color } from "@/Tools/Smart.Color.js";

/**
 * Interpolate between numbers, colors, points, and shapes.
 * Does so as efficiently as possible, by pre-processing the interpolation
 */
export const Interpolate = {
  /**
   * Determines the type of the values, and interpolates between them
   * @param {Number|Color|Point|Array} from
   * @param {Number|Color|Point|Array} to
   * @returns {interpolate}
   */
  from(from, to) {
    const fromType = typeof from;
    if (fromType !== typeof to) return null;

    if (fromType === "number") return Interpolate.numbers(from, to);

    if (fromType === "string") return Interpolate.colors(from, to);

    if (fromType === "object") {
      if (typeof fromType.length === "number") return Interpolate.arrays(from, to);
      if ("x" in fromType && "y" in fromType) return Interpolate.points(from, to);
    }
  },

  /**
   * Interpolates between two numbers
   * @param {Number} from
   * @param {Number} to
   * @returns {interpolateNumbers}
   */
  numbers(from, to) {
    const difference = to - from;
    /**
     * @callback interpolateNumbers
     * @param {number} pct
     * @returns {number}
     */
    return function (pct) {
      return from + pct * difference;
    };
  },

  /**
   * @type Point
   * @property {Number} x
   * @property {Number} y
   */
  /**
   * Interpolates between two points.
   * @param {Point} from
   * @param {Point} to
   * @returns {interpolatePoints}
   */
  points(from, to) {
    /**
     * @callback interpolatePoints
     * @param {number} pct
     * @returns {Point}
     */
    return function (pct) {
      return {
        x: from.x + pct * (to.x - from.x),
        y: from.y + pct * (to.y - from.y),
      };
    };
  },

  /**
   * Interpolates between two colors.
   * @param {String} from
   * @param {String} to
   * @returns {interpolateColors}
   */
  colors(from, to) {
    /**
     * @callback interpolateColors
     * @param {Number} pct
     * @returns {String}
     */

    const fromHSL = Color.parseHSL(from);
    if (fromHSL) {
      const toHSL = Color.parseHSL(to);
      const interpolateHSL = Interpolate.arrays(fromHSL, toHSL);
      return function (pct) {
        return Color.toHSL(interpolateHSL(pct));
      };
    }
    const fromRGB = Color.parseRGB(from);
    if (fromRGB) {
      const toRGB = Color.parseRGB(to);
      const interpolateRGB = Interpolate.arrays(fromRGB, toRGB);
      return function (pct) {
        return Color.toRGB(interpolateRGB(pct));
      };
    }
    return null;
  },

  /**
   * Interpolates all numbers between two arrays.
   * @param {Number[]} from
   * @param {Number[]} to
   * @returns {interpolateArrays}
   */
  arrays(from, to) {
    const length = Math.min(from.length, to.length);
    const interpolate = new Array(length);
    let i = length;
    while (i--) {
      interpolate[i] = Interpolate.from(from[i], to[i]);
    }
    /**
     * @callback interpolateArrays
     * @param {number} pct
     * @returns {Number[]}
     */
    return function (pct) {
      const results = new Array(length);
      let i = length;
      while (i--) {
        results[i] = interpolate[i](pct);
      }
      return results;
    };
  },

  /**
   * Interpolates smoothly between keyframes.
   *
   * @param {*[]} keyframes
   * @param {function({*} from, {*} to)} interpolateMethod
   * @returns {interpolateKeyframes}
   */
  keyframes(keyframes, interpolateMethod) {
    /**
     * @callback interpolateKeyframes
     * @param {number} pct
     * @returns {*}
     */

    const segments = keyframes.length - 1;
    if (segments === 1 && interpolateMethod) return interpolateMethod(keyframes[0], keyframes[1]);

    let lastIndex = -1;
    let lastInterpolate;
    return function (pct) {
      // Min / max:
      if (pct <= 0) return keyframes[0];
      else if (pct >= 1) return keyframes[segments + 1];

      // Current Index & Next Index:
      const pctSegments = pct * segments;
      const index = Math.floor(pctSegments);

      if (!interpolateMethod) return keyframes[index];

      if (lastIndex !== index) {
        lastIndex = index;
        lastInterpolate = interpolateMethod(keyframes[index], keyframes[index + 1]);
      }

      // Interpolate:
      const subPct = pctSegments - index;
      return lastInterpolate(subPct);
    };
  },
};
