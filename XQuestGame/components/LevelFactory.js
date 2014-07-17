XQuestGame.LevelFactory = Smart.Class({
	initialize: function(game) {
		this.game = game;
		
		this.game.onBeforeNewLevel(this._onBeforeNewLevel.bind(this));
	},
	_onBeforeNewLevel: function() {
		var level = this.game.currentLevel
			,numberOfRegularLevels = level
			,B = Balance.bonusLevel1
			,bonusLevel1 = B.bonusLevel
			;
		
		/*
		if (level === bonusLevel1) {
			this._setupBonusLevel1();
			return;
		}
		if (level === bonusLevel1 + 1) {
			this._clearBonusLevel1();
		}
		if (level > bonusLevel1) {
			numberOfRegularLevels--;
		}
		*/
		
		// Set up regular level:
		this._setAlternatingEnemyPool(numberOfRegularLevels);
		this._setCrystalQuantity(numberOfRegularLevels);
	},
	_setAlternatingEnemyPool: function(numberOfRegularLevels) {
		var enemyLineup = Balance.enemies.roster;
		var numberOfAlternateLevels = Math.floor(numberOfRegularLevels / 2)
			,isMaxLevel = (numberOfAlternateLevels >= enemyLineup.length)
			,isEvenLevel = (numberOfRegularLevels % 2) === 0; 

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
		
		this.game.enemyFactory.setEnemyPool(enemyPool);
		
	},
	_setCrystalQuantity: function(numberOfRegularLevels) {
		var spawnQuantity = Balance.crystals.spawnQuantity(numberOfRegularLevels);
		this.game.crystalFactory.setCrystalQuantity(spawnQuantity);
	},
	
	_setupBonusLevel1: function() {
		var B = Balance.bonusLevel1;
		var roster = Balance.enemies.roster;
		
		var bonusLevelText = this.game.gfx.addText("Bonus Level!", 'bonusLevel');
		bonusLevelText.flyIn(2).flyOut(1);
		
		var enemyPool = [ roster[0] ];
		this.game.enemyFactory.setEnemyPool(B.bonusEnemyPool);
		
		this.game.enemyFactory.overrideEnemySpawnRate(B.bonusEnemySpawnRate);
		
		B.bonusPowerups.forEach(function(powerup) {
			this.game.activatePowerup(powerup);
		}, this);
		
		this.game.crystalsGathered(0, 0);
	},
	_clearBonusLevel1: function() {
		this.game.enemyFactory.overrideEnemySpawnRate(null);
	},
});