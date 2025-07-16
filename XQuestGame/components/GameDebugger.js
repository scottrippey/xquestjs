XQuestGame.GameDebugger = Smart.Class({
  initialize: function GameDebugger(game) {
    this.game = game;
  },

  gatherClosestCrystal() {
    this.game.crystalFactory.gatherClosestCrystal(this.game.player.location);
  },
  spawnEnemy() {
    this.game.enemyFactory.spawnNextEnemy();
  },
  activatePowerup(powerupName) {
    this.game.activePowerups.activate(powerupName);
  },
  addBomb() {
    this.game.stats.bombs++;
  },
  killPlayer() {
    this.game.killPlayer();
  },
  spawnPowerCrystal() {
    this.game.powerCrystals.createPowerCrystal();
  },
  toggleFPS() {
    this.game.toggleFPS();
  },
  toggleDebugStats() {
    this.game.toggleDebugStats();
  },
});
