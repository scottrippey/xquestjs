import { Interpolate } from "./Smart.Interpolate.js";

export const Keyframes = {
  fromFunction(keyframes) {
    if (!_.isFunction(keyframes)) return null;

    return keyframes;
  },

  fromNumbers(keyframes) {
    if (!_.isArray(keyframes)) return null;

    return Interpolate.keyframes(keyframes, Interpolate.numbers);
  },

  fromPoints(keyframes) {
    if (!_.isArray(keyframes)) return null;

    return Interpolate.keyframes(keyframes, Interpolate.points);
  },

  fromColors(keyframes) {
    if (!_.isArray(keyframes)) return null;

    return Interpolate.keyframes(keyframes, Interpolate.colors);
  },

  step(keyframes) {
    if (!_.isArray(keyframes)) return null;

    return Interpolate.keyframes(keyframes, false);
  },
};
