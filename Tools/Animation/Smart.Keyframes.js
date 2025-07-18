import { Interpolate } from "@/Tools/Animation/Smart.Interpolate.js";

export const Keyframes = {
  fromFunction(keyframes) {
    if (typeof keyframes !== "function") return null;

    return keyframes;
  },

  fromNumbers(keyframes) {
    if (!Array.isArray(keyframes)) return null;

    return Interpolate.keyframes(keyframes, Interpolate.numbers);
  },

  fromPoints(keyframes) {
    if (!Array.isArray(keyframes)) return null;

    return Interpolate.keyframes(keyframes, Interpolate.points);
  },

  fromColors(keyframes) {
    if (!Array.isArray(keyframes)) return null;

    return Interpolate.keyframes(keyframes, Interpolate.colors);
  },

  step(keyframes) {
    if (!Array.isArray(keyframes)) return null;

    return Interpolate.keyframes(keyframes, false);
  },
};
