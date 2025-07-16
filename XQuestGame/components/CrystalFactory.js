import { Class } from '../../../common/src/Smart/Smart.Class.js';
import { Physics } from '../../../common/src/Smart/Smart.Physics.js';

XQuestGame.CrystalFactory = Class({
	initialize: function CrystalFactory(game) {
		this.game = game;
		this.game.addSceneItem(this);
		this.crystals = [];

		this.game.onNewLevel(this._onNewLevel.bind(this));
	},

	_onNewLevel() {
		this._spawnCrystals();
	},
	_spawnCrystals() {
		var spawnQuantity = Balance.crystals.spawnQuantity(this.game.levelConfig.numberOfRegularLevels);

		if (this.game.levelConfig.crystalsDisabled) {
			spawnQuantity = 0;
		}

		// Clean up:
		this.crystals.forEach(crystal => {
			crystal.dispose();
		}, this);
		this.crystals = [];

		var radius = Balance.crystals.radius;

		this.game.stats.crystalCount = spawnQuantity;

		while (spawnQuantity--) {
			var crystal = this.game.gfx.createCrystalGraphic();
			var spawnPoint = this.game.gfx.getSafeSpawn(radius);
			crystal.moveTo(spawnPoint.x, spawnPoint.y);
			crystal.location = crystal;
			this.crystals.push(crystal);
		}

		Physics.sortByLocation(this.crystals);


		if (this.crystals.length === 0) {
			this.game.crystalsGathered(0, 0);
		}
	},

	onAct(tickEvent) {

		// Check for player-collisions:
		var player = this.game.player;
		this._gatherOnCollision([ player ], player.radius);
	},

	_gatherOnCollision(collisionPoints, maxRadius) {

		var maxDistance = maxRadius + Balance.crystals.radius;

		var crystalsGathered = 0;
		Physics.detectCollisions(this.crystals, collisionPoints, maxDistance, (crystal, point, crystalIndex, pi, distance) => {
			crystal.gatherCrystal(this.game.gfx, this.game.player.location);
			this.crystals.splice(crystalIndex, 1);
			crystalsGathered++;
		});

		if (crystalsGathered) {
			this.game.crystalsGathered(this.crystals.length, crystalsGathered);
			this.game.stats.crystalCount -= crystalsGathered;
		}
	},

	gatherClosestCrystal(location) {
		if (!this.crystals.length) return;

		var crystalIndex = Physics.findClosestPoint(location, this.crystals);
		var crystal = this.crystals[crystalIndex];

		crystal.gatherCrystal(this.game.gfx, this.game.player.location);
		this.crystals.splice(crystalIndex, 1);

		this.game.crystalsGathered(this.crystals.length, 1);

		this.game.stats.crystalCount -= 1;
	}
});
