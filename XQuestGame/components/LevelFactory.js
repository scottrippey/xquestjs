XQuestGame.LevelFactory = Smart.Class({
	initialize: function(game) {
		this.game = game;
		
		this.game.onConfigureLevel(this._onConfigureLevel.bind(this));
	}
	,_onConfigureLevel: function(levelConfig) {
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
		this._showLevelNumber(levelConfig);
	}
	,_setAlternatingEnemyPool: function(levelConfig) {
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
	}
	
	,_setupBonusLevel1: function(levelConfig) {
		var B = Balance.bonusLevel1;
		var roster = Balance.enemies.roster;
		
		var bonusLevelText = this.game.gfx.addText("Bonus Level:\n Rapid Fire!", 'bonusLevel');
		bonusLevelText.flyIn(2).flyOut(1);
		
		var enemyPool = [ roster[0] ];
		
		levelConfig.enemyPool = enemyPool;
		levelConfig.enemySpawnRateOverride = B.bonusEnemySpawnRate;
		levelConfig.crystalsDisabled = true;
		levelConfig.bombCrystalsDisabled = true;
		levelConfig.bombsDisabled = true;
		levelConfig.powerCrystalsDisabled = true;
		levelConfig.skipLevelOnPlayerDeath = true;
		
		B.bonusPowerups.forEach(function(powerup) {
			this.game.activePowerups.activate(powerup, true);
		}, this);
	}
	
	
	,_showLevelNumber: function(levelConfig) {
		var level = "Level " + levelConfig.numberOfRegularLevels;

		var textGfx = this.game.gfx.addText(level, { textBaseline: 'top' });
		textGfx.flyIn(1.5).flyOut(2);
	}
	
});