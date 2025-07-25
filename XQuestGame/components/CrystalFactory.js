import { Physics } from "@/Tools/Smart.Physics.js";
import { Balance } from "@/XQuestGame/options/Balance.js";

export class CrystalFactory {
  constructor(game) {
    this.game = game;
    this.game.addSceneItem(this);
    this.crystals = [];

    this.game.onNewLevel(this._onNewLevel.bind(this));
  }

  _onNewLevel() {
    this._spawnCrystals();
  }
  _spawnCrystals() {
    let spawnQuantity = Balance.crystals.spawnQuantity(this.game.levelConfig.numberOfRegularLevels);

    if (this.game.levelConfig.crystalsDisabled) {
      spawnQuantity = 0;
    }

    // Clean up:
    this.crystals.forEach((crystal) => {
      crystal.dispose();
    }, this);
    this.crystals = [];

    const radius = Balance.crystals.radius;

    this.game.stats.crystalCount = spawnQuantity;

    while (spawnQuantity--) {
      const crystal = this.game.gfx.createCrystalGraphic();
      const spawnPoint = this.game.gfx.getSafeSpawn(radius);
      crystal.moveTo(spawnPoint.x, spawnPoint.y);
      crystal.location = crystal;
      this.crystals.push(crystal);
    }

    Physics.sortByLocation(this.crystals);

    if (this.crystals.length === 0) {
      this.game.crystalsGathered(0, 0);
    }
  }

  onAct(tickEvent) {
    // Check for player-collisions:
    const player = this.game.player;
    this._gatherOnCollision([player], player.radius);
  }

  _gatherOnCollision(collisionPoints, maxRadius) {
    const maxDistance = maxRadius + Balance.crystals.radius;

    let crystalsGathered = 0;
    Physics.detectCollisions(
      this.crystals,
      collisionPoints,
      maxDistance,
      (crystal, point, crystalIndex, pi, distance) => {
        crystal.gatherCrystal(this.game.gfx, this.game.player.location);
        this.crystals.splice(crystalIndex, 1);
        crystalsGathered++;
      },
    );

    if (crystalsGathered) {
      this.game.crystalsGathered(this.crystals.length, crystalsGathered);
      this.game.stats.crystalCount -= crystalsGathered;
    }
  }

  gatherClosestCrystal(location) {
    if (!this.crystals.length) return;

    const crystalIndex = Physics.findClosestPoint(location, this.crystals);
    const crystal = this.crystals[crystalIndex];

    crystal.gatherCrystal(this.game.gfx, this.game.player.location);
    this.crystals.splice(crystalIndex, 1);

    this.game.crystalsGathered(this.crystals.length, 1);

    this.game.stats.crystalCount -= 1;
  }
}
