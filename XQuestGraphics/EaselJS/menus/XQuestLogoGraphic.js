import { Drawing } from "../utils/Drawing.js";

Balance.onUpdate((gameMode) => {
  Graphics.merge({
    xquestLogo: {
      height: 160,
      QThickness: 15,
      QTailLength: 30,
      fontSize: 150,
      textColor: "white",
      xColor: "yellow",
      show: { duration: 3 },
      hide: { duration: 2 },
    },
  });
});

export class XQuestLogoGraphic extends createjs.Container {
  constructor(gfx) {
    super();
    this.gfx = gfx;
    this._addX_Q_UEST();
  }
  _addX_Q_UEST() {
    const X = new LogoParts.X();
    this.addChild(X);

    const Q = new LogoParts.Q();
    this.addChild(Q);

    const QTail = new LogoParts.QTail();
    this.addChild(QTail);

    const UEST = new LogoParts.UEST();
    this.addChild(UEST);

    this.X = X;
    this.Q = Q;
    this.QTail = QTail;
    this.UEST = UEST;

    // Layout:
    let left = 0;

    left += X.visibleWidth / 2;
    X.moveTo(left, 20);
    left += X.visibleWidth / 2 + 10;

    left += Q.visibleWidth / 2;
    Q.moveTo(left, 0);
    Q.scaleX = 0.8;
    QTail.moveTo(left, 0);
    QTail.scaleX = 0.8;
    left += Q.visibleWidth / 2 + 10;

    UEST.moveTo(left, 70);
    left += UEST.visibleWidth;

    const G = Graphics.xquestLogo;
    this.visibleHeight = G.height;
    this.visibleWidth = left;
  }

  showLogo() {
    const G = Graphics.xquestLogo;
    const logo = this;
    const X = this.X;
    const Q = this.Q;
    const UEST = this.UEST;
    logo.alpha = 0;
    this.animation = this.gfx
      .addAnimation()
      .duration(G.show.duration)
      .savePosition()
      .easeOut()
      .fade(logo, 1)
      .restorePosition();

    return this.animation;
  }

  hideLogo() {
    const G = Graphics.xquestLogo;
    const logo = this;
    const X = this.X;
    const Q = this.Q;
    const QTail = this.QTail;
    const UEST = this.UEST;
    const spinRate = 270;
    let firstSpin;
    this.animation.cancelAnimation();
    this.animation = this.gfx
      .addAnimation()
      .duration(G.hide.duration)
      .savePosition()

      .ease()
      .move(X, Q)
      .scale(X, 0.8)
      .restorePosition()
      .easeIn("swing")
      .rotate(X, (firstSpin = spinRate * G.hide.duration * 0.5))
      .restorePosition()
      .ease()
      .tween([Q.scaleX, 1], (scaleX) => {
        Q.scaleX = scaleX;
      })
      .fade(QTail, 0)
      .fade(UEST, 0)

      .queue()
      .duration(G.hide.duration / 2)
      .rotate(X, firstSpin + (spinRate * G.hide.duration) / 2)
      .easeIn()
      .savePosition()
      .fade(logo, 0)
      .restorePosition();
    return this.animation;
  }
}

const LogoParts = {
  X: class extends Drawing {
    drawStatic(drawing) {
      const G = Graphics.xquestLogo;
      const radius = G.height / 2;
      this.visibleWidth = G.height * 0.7;

      drawing.beginPath().star(0, 0, radius, 4, 0.8, 45).endPath({ fillStyle: G.xColor });
    }
  },
  Q: class extends Drawing {
    drawStatic(drawing) {
      const G = Graphics.xquestLogo;
      const radius = G.height / 2;
      const QThickness = G.QThickness;
      const QTailLength = G.QTailLength;

      this.visibleWidth = G.height;

      drawing
        .beginPath()
        .circle(0, 0, radius)
        .endPath({ strokeStyle: G.textColor, lineWidth: QThickness });

      this.rotation = 45;
    }
  },
  QTail: class extends Drawing {
    drawStatic(drawing) {
      const G = Graphics.xquestLogo;
      const radius = G.height / 2;
      const QThickness = G.QThickness;
      const QTailLength = G.QTailLength;

      drawing
        .beginPath()
        .rect(radius + QThickness / 2 - 1, -QThickness / 2, QTailLength, QThickness - 2)
        .endPath({ fillStyle: G.textColor });

      this.rotation = 45;
    }
  },
  UEST: class extends Drawing {
    drawStatic(drawing) {
      const G = Graphics.xquestLogo;

      this.visibleWidth = G.height * 2;

      drawing.font(`${G.fontSize}px "Segoe UI"`).fillStyle(G.textColor).fillText("uest", 0, 0);
    }
  },
};
