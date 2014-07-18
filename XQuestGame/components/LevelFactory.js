XQuestGame.LevelFactory = Smart.Class({
	initialize: function(game) {
		this.game = game;
		
		this.game.onConfigureLevel(this._onConfigureLevel.bind(this));
	},
	_onConfigureLevel: function(levelConfig) {
		var level = this.game.currentLevel;

		levelConfig.numberOfRegularLevels = level;
		
		var B = Balance.bonusLevel1,
			bonusLevel1 = B.bonusLevel;
		if (level === bonusLevel1) {
			this._setupBonusLevel1(levelConfig);
			return;
		} else if (level > bonusLevel1) {
			levelConfig.numberOfRegularLevels--;
		}
		
		// Set up regular level:
		this._setAlternatingEnemyPool(levelConfig);
	},
	_setAlternatingEnemyPool: function(levelConfig) {
		var enemyLineup = Balance.enemies.roster;
		var numberOfAlternateLevels = Math.floor(levelConfig.numberOfRegularLevels / 2)
			,isMaxLevel = (numberOfAlternateLevels >= enemyLineup.length)
			,isEvenLevel = (levelConfig.numberOfRegularLevels % 2) === 0; 

		var enemyPool;
		if (isMaxLevel) {
			// Very high levels include all enemies:
			enemyPool = enemyLineup;
		} else if (isEvenLevel) {
			// Even levels only include the current enemy:
			enemyPool = [ enemyLineup[numberOfAlternateLevels] ];
		} else {
			// Odd levels include a variety of enemies, up to the current level index:
			enemyPool = enemyLineup.slice(0, numberOfAlternateLevels + 1);
		}
		
		levelConfig.enemyPool = enemyPool;
	},
	
	_setupBonusLevel1: function(levelConfig) {
		var B = Balance.bonusLevel1;
		var roster = Balance.enemies.roster;
		
		var bonusLevelText = this.game.gfx.addText("Bonus Level!", 'bonusLevel');
		bonusLevelText.flyIn(2).flyOut(1);
		
		var enemyPool = [ roster[0] ];
		
		levelConfig.enemyPool = enemyPool;
		levelConfig.enemySpawnRateOverride = B.bonusEnemySpawnRate;
		levelConfig.crystalSpawnQuantityOverride = 0;
		levelConfig.bombCrystalQuantityOverride = 0;
		
		B.bonusPowerups.forEach(function(powerup) {
			this.game.activatePowerup(powerup);
		}, this);
		
		this.game.crystalsGathered(0, 0);
	},
});