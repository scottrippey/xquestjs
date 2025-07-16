import { Class } from "@/common/src/Smart/Smart.Class.js";

export const BombCrystal = Class({
  initialize: function BombCrystal(game) {
    this.game = game;
    this.location = this.game.gfx.createBombCrystalGraphic();
    this.radius = Balance.bombCrystals.radius;
  },
  spawnBomb(location) {
    this.location.moveTo(location.x, location.y);
  },
  gatherBombCrystal() {
    this.location.gatherBombCrystal(this.game.gfx, this.game.player.location);
  },
  clearBombCrystal() {
    this.location.dispose();
  },
});
