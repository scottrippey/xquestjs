EaselJSGraphics.BombGraphic = Smart.Class(new createjs.Shape(), {
  initialize: function BombGraphic() {
    this.location = this;
    this.radius = Balance.player.radius;
  },

  _setupGraphics() {
    var G = Graphics.bombs;
    this.graphics.clear().beginStyle(G.style).drawCircle(0, 0, this.radius).endStyle(G.style);
  },

  onTick(tickEvent) {
    var B = Balance.bombs;
    var bounds = Balance.level.bounds;
    this.radius += B.speed * tickEvent.deltaSeconds;
    this.alpha = 1 - this.radius / bounds.totalWidth;
    if (this.alpha <= 0) {
      this.dispose();
    }
    this._setupGraphics();
  },

  getKickBack(enemy, distance) {
    var impactVector = Smart.Point.subtract(enemy.location, this.location);
    return Smart.Point.scaleVector(impactVector, Balance.bombs.speed * Balance.bombs.kickBack);
  },
});
