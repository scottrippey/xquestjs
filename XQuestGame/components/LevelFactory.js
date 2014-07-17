XQuestGame.LevelFactory = Smart.Class({
	initialize: function(game) {
		this.game = game;
		
		this.game.onNewLevel(this._onNewLevel.bind(this));
	},
	_onNewLevel: function() {
		var currentLevel = this.game.currentLevel;
		
		this._setAlternatingEnemyPool(currentLevel);
	},
	_setAlternatingEnemyPool: function(currentLevel) {
		var enemyLineup = Balance.enemies.roster;

		var alternatingLevel = Math.floor(currentLevel / 2)
			, enemyPool;
		if (alternatingLevel >= enemyLineup.length) {
			// Very high levels include all enemies:
			enemyPool = enemyLineup;
		} else if ((currentLevel % 2) === 0) {
			// Even levels only include the current enemy:
			enemyPool = [ enemyLineup[alternatingLevel] ];
		} else {
			// Odd levels include a variety of enemies, up to the current level index:
			enemyPool = enemyLineup.slice(0, alternatingLevel + 1);
		}
		
		this.game.enemyFactory.setEnemyPool(enemyPool);
	}
});