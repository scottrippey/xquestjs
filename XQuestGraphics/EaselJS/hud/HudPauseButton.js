import { Graphics } from "@/XQuestGraphics/EaselJS/Graphics.js";
import { Balance } from "@/XQuestGame/options/Balance.js";
import { TextGraphic } from "@/XQuestGraphics/EaselJS/effects/TextGraphics.js";

Balance.onUpdate((gameMode) => {
  Graphics.merge({
    hudGraphics: {
      button: {
        padding: 5,
        cornerRadius: 4,
        style: {
          strokeWidth: 1,
          strokeColor: "hsla(0, 100%, 100%, 0.3)",
          fillColor: "hsla(0, 100%, 100%, 0.1)",
        },
      },
      pauseButton: { width: 50 + 22 + 8, height: 20 + 8 },
      pauseIcon: {
        style: { fillColor: "hsla(0, 100%, 100%, 0.2)" },
        rectWidth: 8,
        rectHeight: 20,
        iconWidth: 22,
        rectRadius: 2,
      },
      sandwichIcon: {
        style: { fillColor: "hsla(0, 100%, 100%, 0.2)" },
        rectWidth: 20,
        rectHeight: 4,
        iconHeight: 15,
        rectRadius: 2,
      },
    },
  });
});

export class HudButton extends createjs.Container {
  constructor(gfx, width, height) {
    super();
    this.gfx = gfx;
    this.width = width;
    this.height = height;
    this._setupButtonBackground();
  }

  _setupButtonBackground() {
    const button = Graphics.hudGraphics.button;

    const background = new createjs.Shape();
    background.graphics
      .clear()
      .beginStyle(button.style)
      .drawRoundRect(0, 0, this.width, this.height, button.cornerRadius)
      .endStyle(button.style);

    this.addChild(background);
  }
}

export class HudPauseButton extends HudButton {
  constructor(gfx) {
    const pauseButton = Graphics.hudGraphics.pauseButton;
    super(gfx, pauseButton.width, pauseButton.height);

    this._setupGraphics();
  }
  _setupGraphics() {
    const pauseButton = Graphics.hudGraphics.pauseButton;

    const text = this._createText();
    text.textAlign = "right";
    text.moveTo(pauseButton.width / 2, pauseButton.height / 2);
    this.addChild(text);

    const icon = this._createSandwichIcon();
    const padding = (pauseButton.height - icon.height) / 2;
    icon.moveTo(pauseButton.width - icon.width - padding, padding);
    this.addChild(icon);
  }
  _createText() {
    const pauseButton = Graphics.hudGraphics.pauseButton;
    const pauseText = new TextGraphic();
    pauseText.setText("Pause", "hudText");

    this.addChild(pauseText);
    return pauseText;
  }
  _createPauseIcon() {
    const pauseIcon = Graphics.hudGraphics.pauseIcon;
    const icon = new createjs.Shape();
    icon.graphics
      .beginStyle(pauseIcon.style)
      .drawRoundRect(0, 0, pauseIcon.rectWidth, pauseIcon.rectHeight, pauseIcon.rectRadius)
      .drawRoundRect(
        pauseIcon.iconWidth - pauseIcon.rectWidth,
        0,
        pauseIcon.rectWidth,
        pauseIcon.rectHeight,
        pauseIcon.rectRadius,
      )
      .endStyle(pauseIcon.style);

    this.addChild(icon);
    return icon;
  }
  _createSandwichIcon() {
    const sandwichIcon = Graphics.hudGraphics.sandwichIcon;
    const bottomRow = sandwichIcon.iconHeight - sandwichIcon.rectHeight;
    const middleRow = (sandwichIcon.iconHeight - sandwichIcon.rectHeight) / 2;
    const icon = new createjs.Shape();
    icon.graphics
      .beginStyle(sandwichIcon.style)
      .drawRoundRect(0, 0, sandwichIcon.rectWidth, sandwichIcon.rectHeight, sandwichIcon.rectRadius)
      .drawRoundRect(
        0,
        middleRow,
        sandwichIcon.rectWidth,
        sandwichIcon.rectHeight,
        sandwichIcon.rectRadius,
      )
      .drawRoundRect(
        0,
        bottomRow,
        sandwichIcon.rectWidth,
        sandwichIcon.rectHeight,
        sandwichIcon.rectRadius,
      )
      .endStyle(sandwichIcon.style);
    icon.width = sandwichIcon.rectWidth;
    icon.height = sandwichIcon.iconHeight;

    this.addChild(icon);
    return icon;
  }
}
