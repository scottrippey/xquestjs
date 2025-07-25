import { Balance } from "@/XQuestGame/options/Balance.js";

export class LevelFactory {
  constructor(game) {
    this.game = game;

    this.game.onConfigureLevel(this._onConfigureLevel.bind(this));
  }
  _onConfigureLevel(levelConfig) {
    const level = this.game.currentLevel;

    levelConfig.numberOfRegularLevels = level;

    const bonusLevel1 = Balance.bonusLevel1.bonusLevel;
    if (level === bonusLevel1) {
      this._setupBonusLevel1(levelConfig);
      return;
    } else if (level > bonusLevel1) {
      levelConfig.numberOfRegularLevels--;
    }

    const bonusLevel2 = Balance.bonusLevel2.bonusLevel;
    if (level === bonusLevel2) {
      this._setupBonusLevel2(levelConfig);
      return;
    } else if (level > bonusLevel2) {
      levelConfig.numberOfRegularLevels--;
    }

    // Set up regular level:
    this._setAlternatingEnemyPool(levelConfig);
    this._showLevelNumber(levelConfig);
  }
  _setAlternatingEnemyPool(levelConfig) {
    const enemyLineup = Balance.enemies.roster;
    const numberOfAlternateLevels = Math.floor(levelConfig.numberOfRegularLevels / 2);
    const isMaxLevel = numberOfAlternateLevels >= enemyLineup.length;
    const isEvenLevel = levelConfig.numberOfRegularLevels % 2 === 0;

    let enemyPool;
    if (isMaxLevel) {
      // Very high levels include all enemies:
      enemyPool = enemyLineup;
    } else if (isEvenLevel) {
      // Even levels only include the current enemy:
      enemyPool = [enemyLineup[numberOfAlternateLevels]];
    } else {
      // Odd levels include a variety of enemies, up to the current level index:
      enemyPool = enemyLineup.slice(0, numberOfAlternateLevels + 1);
    }

    levelConfig.enemyPool = enemyPool;
  }

  _setupBonusLevel1(levelConfig) {
    const B = Balance.bonusLevel1;

    const bonusLevelText = this.game.gfx.addText("Bonus Level:\nRapid Fire!", "bonusLevel");
    bonusLevelText.flyIn(2).flyOut(1);

    levelConfig.enemyPool = B.bonusEnemyPool;
    levelConfig.enemySpawnRateOverride = B.bonusEnemySpawnRate;
    levelConfig.crystalsDisabled = true;
    levelConfig.bombCrystalsDisabled = true;
    levelConfig.bombsDisabled = true;
    levelConfig.powerCrystalsDisabled = true;
    levelConfig.skipLevelOnPlayerDeath = true;

    B.bonusPowerups.forEach(function (powerup) {
      this.game.activePowerups.activate(powerup, true);
    }, this);
  }
  _setupBonusLevel2(levelConfig) {
    const B = Balance.bonusLevel2;

    const bonusLevelText = this.game.gfx.addText("Bonus Level:\nSmash the enemies!", "bonusLevel");
    bonusLevelText.flyIn(2).flyOut(1);

    levelConfig.enemyPool = B.bonusEnemyPool;
    levelConfig.enemySpawnRateOverride = B.bonusEnemySpawnRate;
    levelConfig.crystalsDisabled = true;
    levelConfig.bombCrystalsDisabled = true;
    levelConfig.bombsDisabled = true;
    levelConfig.shootingDisabled = true;
    levelConfig.powerCrystalsDisabled = true;
    levelConfig.skipLevelOnPlayerDeath = true;

    B.bonusPowerups.forEach(function (powerup) {
      this.game.activePowerups.activate(powerup, true);
    }, this);
  }

  _showLevelNumber(levelConfig) {
    const level = `Level ${levelConfig.numberOfRegularLevels}`;

    const textGfx = this.game.gfx.addText(level, { textBaseline: "top" });
    textGfx.flyIn(1.5).flyOut(2);
  }
}
