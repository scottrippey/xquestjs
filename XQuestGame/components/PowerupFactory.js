import { Class } from "@/common/src/Smart/Smart.Class.js";
import { Physics } from "@/common/src/Smart/Smart.Physics.js";

XQuestGame.PowerupFactory = Class({
  initialize: function PowerupFactory(game) {
    this.game = game;
    this.game.addSceneItem(this);
    this.powerCrystals = [];
    this.bombCrystals = [];

    this.game.onNewLevel(this._onNewLevel.bind(this));
  },

  onMove(tickEvent) {
    if (this._shouldSpawn(tickEvent)) {
      this.createPowerCrystal();
    }
  },

  _shouldSpawn(tickEvent) {
    const B = Balance.powerCrystals;

    if (this.game.levelConfig.powerCrystalsDisabled) {
      return false;
    }

    // TODO: Make this performance-based instead of time-based:
    const isFirstRun = this.nextSpawn === undefined;
    const shouldSpawn = !isFirstRun && this.nextSpawn <= tickEvent.runTime;
    if (isFirstRun || shouldSpawn) {
      this.nextSpawn = tickEvent.runTime + B.spawnRate() * 1000;
    }
    return shouldSpawn;
  },

  onAct(tickEvent) {
    if (this.powerCrystals.length >= 2) {
      Physics.sortByLocation(this.powerCrystals);
    }

    // Check for bullet-collisions:

    // Check for player-collisions:
    const player = this.game.player;
    this._gatherOnCollision([player], player.radius);

    if (this.bombCrystals.length) {
      if (this.bombCrystals.length >= 2) {
        Physics.sortByLocation(this.bombCrystals);
      }

      const maxDistance = Balance.player.radius + Balance.bombCrystals.radius;

      Physics.detectCollisions(
        this.bombCrystals,
        [this.game.player],
        maxDistance,
        (bombCrystal, player, bombIndex, pi, distance) => {
          this.bombCrystals.splice(bombIndex, 1);
          bombCrystal.gatherBombCrystal();
          this.game.stats.bombs++;
        },
      );
    }
  },

  createPowerCrystal() {
    const powerCrystal = new XQuestGame.PowerCrystal(this.game);
    const spawnInfo = this.game.enemyFactory.getRandomSpawn(powerCrystal.radius);
    powerCrystal.spawn(spawnInfo);
    this.powerCrystals.push(powerCrystal);
  },

  _nextPowerup() {
    const B = Balance.powerups;
    let totalFrequency = 0;
    _.forOwn(
      B,
      function (p, powerupName) {
        if (powerupName in this.game.activePowerups) return;
        totalFrequency += p.frequency;
      },
      this,
    );
    let result;
    if (totalFrequency !== 0) {
      // Choose from the available powerups:
      let randomPowerupIndex = Math.random() * totalFrequency;
      _.forOwn(
        B,
        function (powerup, powerupName) {
          if (powerupName in this.game.activePowerups) return;
          randomPowerupIndex -= powerup.frequency;
          if (randomPowerupIndex <= 0) {
            result = powerupName;
            return false;
          }
        },
        this,
      );
    } else {
      // All powerups already gained, so start renewing some:
      result = null;
      let resultTime = null;
      _.forOwn(
        B,
        function (powerup, powerupName) {
          const activeTime = this.game.activePowerups[powerupName];

          if (resultTime === null || activeTime < resultTime) {
            resultTime = activeTime;
            result = powerupName;
          }
        },
        this,
      );
    }
    return result;
  },

  _gatherOnCollision(collisionPoints, maxRadius) {
    const maxDistance = maxRadius + Balance.powerCrystals.radius;

    Physics.detectCollisions(
      this.powerCrystals,
      collisionPoints,
      maxDistance,
      (powerCrystal, point, crystalIndex, pi, distance) => {
        this.powerCrystals.splice(crystalIndex, 1);
        powerCrystal.gatherPowerCrystal();
        const powerupName = this._nextPowerup();
        this.game.activePowerups.activate(powerupName);
      },
    );
  },

  _onNewLevel() {
    this._clearBombCrystals();

    let bombCrystalQuantity = Balance.bombCrystals.spawnQuantity(this.game);

    if (this.game.levelConfig.bombCrystalsDisabled) {
      bombCrystalQuantity = 0;
    }

    while (bombCrystalQuantity--) {
      this.createBombCrystal();
    }
  },

  createBombCrystal() {
    const bombCrystal = new XQuestGame.BombCrystal(this.game);
    const randomSpawnLocation = this.game.gfx.getSafeSpawn(bombCrystal.radius);
    bombCrystal.spawnBomb(randomSpawnLocation);

    this.bombCrystals.push(bombCrystal);
  },

  clearAllPowerCrystals() {
    _.forEach(
      this.powerCrystals,
      (powerCrystal) => {
        powerCrystal.clearPowerCrystal();
      },
      this,
    );
    this.powerCrystals.length = 0;
  },

  _clearBombCrystals() {
    _.forEach(
      this.bombCrystals,
      (bombCrystal) => {
        bombCrystal.clearBombCrystal();
      },
      this,
    );
    this.bombCrystals.length = 0;
  },
});
