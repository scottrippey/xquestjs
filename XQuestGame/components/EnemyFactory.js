import { Animation } from "@/Tools/Animation/Smart.Animation.js";
import { Physics } from "@/Tools/Smart.Physics.js";
import { Balance } from "@/XQuestGame/options/Balance.js";

export class EnemyFactory {
  constructor(game) {
    this.game = game;
    this.enemies = [];
  }

  onAct(tickEvent) {
    if (this.nextEnemySpawn == null) {
      this._calculateNextEnemySpawn(tickEvent.runTime);
    } else if (this.nextEnemySpawn <= tickEvent.runTime) {
      this.spawnNextEnemy();
      this._calculateNextEnemySpawn(tickEvent.runTime);
    }
    if (this.enemies.length >= 2) {
      Physics.sortByLocation(this.enemies);
    }
  }

  _calculateNextEnemySpawn(runTime) {
    let spawnRate = Balance.enemies.spawnRate();
    const spawnRateOverride = this.game.levelConfig.enemySpawnRateOverride;
    if (spawnRateOverride) spawnRate = spawnRateOverride();
    this.nextEnemySpawn = runTime + spawnRate * 1000;
  }

  spawnNextEnemy() {
    const enemyPool = this.game.levelConfig.enemyPool;

    let randomEnemyIndex;
    if (enemyPool.length === 1) {
      randomEnemyIndex = 0;
    } else {
      // Prefer to spawn more difficult enemies:
      const weightedRandom = 1 - Math.pow(Math.random(), Balance.enemies.spawnDifficulty);
      randomEnemyIndex = Math.floor(weightedRandom * enemyPool.length);
    }

    const enemyCtor = enemyPool[randomEnemyIndex];

    const enemy = new enemyCtor(this.game);
    this.enemies.push(enemy);

    const spawnInfo = this.getRandomSpawn(enemy.radius);
    enemy.spawn(spawnInfo);
    this.game.gfx
      .addAnimation(new Animation().duration(1).easeOut("quint").scale(enemy.location, [0, 1]))
      .update(0);
  }

  getRandomSpawn(enemyRadius) {
    const bounds = Balance.level.bounds;
    const spawnSide = Math.floor(Math.random() * 2) ? 1 : 2;

    const spawnInfo = {
      x: spawnSide === 1 ? bounds.x + enemyRadius : bounds.x + bounds.width - enemyRadius,
      y: bounds.y + bounds.height / 2,
      side: spawnSide,
    };

    return spawnInfo;
  }

  killEnemiesOnCollision(sortedItems, maxItemRadius, collisionCallback) {
    const enemies = this.enemies;
    const maxDistance = maxItemRadius + Balance.enemies.maxRadius;
    Physics.detectCollisions(enemies, sortedItems, maxDistance, (enemy, item, ei, ii, distance) => {
      if (enemy.isDead) return;

      const theseSpecificItemsDidCollide = distance <= enemy.radius + item.radius;
      if (theseSpecificItemsDidCollide) {
        const hitPoints = item.hitPoints || 1;
        const kickBack = (item.getKickBack && item.getKickBack(enemy, distance)) || null;
        const stayAlive = enemy.takeDamage(hitPoints, kickBack);
        if (!stayAlive) enemy.isDead = true;

        if (collisionCallback) collisionCallback(enemy, item, ei, ii, distance);
      }
    });

    // Remove dead enemies:
    let i = enemies.length;
    while (i--) {
      if (enemies[i].isDead) {
        this.enemies.splice(i, 1);
      }
    }
  }

  killAllEnemies() {
    this.enemies.forEach((enemy) => {
      enemy.takeDamage(Number.POSITIVE_INFINITY, null);
    }, this);
    this.enemies.length = 0;
  }

  clearAllEnemies() {
    this.enemies.forEach((enemy) => {
      enemy.clearEnemy();
    });
    this.enemies.length = 0;
  }

  findClosestEnemy(location) {
    const enemyLocations = this.enemies.map((enemy) => enemy.location); // Perhaps this could be improved, but it's not mission-critical
    const enemyIndex = Physics.findClosestPoint(location, enemyLocations);

    return this.enemies[enemyIndex];
  }
}
