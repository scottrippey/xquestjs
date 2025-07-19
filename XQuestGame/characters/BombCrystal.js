import { Balance } from "@/XQuestGame/options/Balance.js";
export class BombCrystal {
  constructor(game) {
    this.game = game;
    this.location = this.game.gfx.createBombCrystalGraphic();
    this.radius = Balance.bombCrystals.radius;
  }
  spawnBomb(location) {
    this.location.moveTo(location.x, location.y);
  }
  gatherBombCrystal() {
    this.location.gatherBombCrystal(this.game.gfx, this.game.player.location);
  }
  clearBombCrystal() {
    this.location.dispose();
  }
}
