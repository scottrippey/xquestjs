Balance.onUpdate((gameMode) => {
  Graphics.merge({
    bullets: {
      radius: Balance.bullets.radius,
      style: {
        fillStyle: "white",
      },
    },
  });
});

EaselJSGraphics.BulletsGraphics = Smart.Class(new EaselJSGraphics.Drawing(), {
  setup() {
    this.bullets = [];
  },
  addBullet() {
    const bullet = new EaselJSGraphics.BulletsGraphics.Bullet();
    this.bullets.push(bullet);
    bullet.onDispose(() => {
      const index = this.bullets.indexOf(bullet);
      this.bullets.splice(index, 1);
    });
    return bullet;
  },
  drawEffects(drawing) {
    const G = Graphics.bullets;

    drawing.beginPath();

    let i = this.bullets.length;
    while (i--) {
      const bullet = this.bullets[i];
      drawing.moveTo(bullet.x + G.radius, bullet.y).circle(bullet.x, bullet.y, G.radius);
    }
    drawing.endPath(G.style);
  },
});
EaselJSGraphics.BulletsGraphics.Bullet = Smart.Class(new Smart.Disposable(), {
  moveTo(x, y) {
    this.x = x;
    this.y = y;
  },
  getKickBack(enemy, distance) {
    const B = Balance.bullets;
    return Smart.Point.multiply(this.velocity, B.kickBack);
  },
});
