import { Class } from "@/common/src/Smart/Smart.Class.js";
import { Animation } from "@/common/src/Smart/Animation/Smart.Animation.js";
import { Drawing } from "../utils/Drawing.js";

Balance.onUpdate((gameMode) => {
  Graphics.merge({
    textStyles: {
      default: {
        fontWeight: "normal",
        fontSize: "48px",
        fontFamily: '"Segoe UI"',
        color: "white",
        textAlign: "center",
        textBaseline: "middle",
      },

      powerupActive: {
        fontSize: "30px",
        color: "hsl(120, 100%, 80%)",
        textBaseline: "bottom",
      },

      powerupDeactive: {
        fontSize: "24px",
        color: "hsl(0, 100%, 80%)",
        textBaseline: "bottom",
      },

      bonusLevel: {
        fontSize: "40px",
        color: "hsl(60, 100%, 80%)",
      },

      hudText: {
        fontSize: "12px",
        color: "white",
        textBaseline: "middle",
        textAlign: "left",
      },

      menuButton: {
        fontSize: "40px",
        color: "white",
        textBaseline: "middle",
        textAlign: "center",
      },
    },
  });
});

export const TextGraphic = Class(new Drawing(), {
  setGfx(gfx) {
    this.gfx = gfx;
    this.animation = gfx.addAnimation(new Animation());
    this.start("top");
  },

  setText(text, textStyle) {
    const textStyles = Graphics.textStyles;

    this.text = text;

    if (typeof textStyle === "string") {
      textStyle = textStyles[textStyle];
    }

    textStyle = textStyle ? _.defaults({}, textStyle, textStyles.default) : textStyles.default;
    this.font = [textStyle.fontWeight, textStyle.fontSize, textStyle.fontFamily].join(" ");
    this.color = textStyle.color;

    this.textAlign = textStyle.textAlign;
    this.textBaseline = textStyle.textBaseline;
  },

  start(gamePoint) {
    const location = this.gfx.getHudPoint(gamePoint);
    this.moveTo(location.x, location.y);
    return this;
  },

  flyIn(duration, to) {
    const toLocation = this.gfx.getHudPoint(to || "middle");

    const txt = this;
    this.animation
      .duration(duration)
      .easeOut()
      .fade(txt, [0, 1])
      .move(txt, toLocation)
      .rotate(txt, [30, 0])
      .queue()
      .update(0);

    return this;
  },

  flyOut(duration, to) {
    const toLocation = this.gfx.getHudPoint(to || "bottom");

    const txt = this;
    this.animation
      .duration(duration)
      .easeIn()
      .fade(txt, [1, 0])
      .move(txt, toLocation)
      .rotate(txt, [0, 30])
      .queueDispose(txt);

    return this;
  },

  queue(callback) {
    this.animation.queue(callback);
    return this;
  },

  delay(duration) {
    this.animation.delay(duration);

    return this;
  },
});
