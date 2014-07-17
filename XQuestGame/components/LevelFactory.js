XQuestGame.LevelFactory = Smart.Class({
	initialize: function(game) {
		this.game = game;
		
		this.game.onNewLevel(this._onNewLevel.bind(this));
	},
	_onNewLevel: function(level) {
		var currentLevel = this.game.currentLevel;
		var currentEnemyLineupIndex = Math.floor(currentLevel / 2);

		var enemyLineup = Balance.enemies.roster, enemyPool;

		if (currentEnemyLineupIndex >= enemyLineup.length) {
			// Very high levels include all enemies:
			enemyPool = enemyLineup;
		} else if ((currentLevel % 2) === 0) {
			// Even levels only include the current enemy:
			enemyPool = [ enemyLineup[currentEnemyLineupIndex] ];
		} else {
			// Odd levels include a variety of enemies, up to the current level index:
			enemyPool = enemyLineup.slice(0, currentEnemyLineupIndex + 1);
		}
		
		this.game.enemyFactory.setEnemyPool(enemyPool);
	}
});