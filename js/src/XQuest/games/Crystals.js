var Crystals = new Class({
	Implements: [ AnimationQueue ]
	,
	initialize: function(game) {
		this.game = game;
		this.game.addGameItem(this);
		this._crystals = [];
	}
	,
	createCrystals: function(count) {
		var bounds = Balance.level.bounds
			,randomX = function() { return bounds.x + Math.random() * bounds.width; }
			,randomY = function() { return bounds.y + Math.random() * bounds.height; };


		while (count--) {
			var crystal = this.game.gfx.createCrystalGraphic();
			crystal.x = randomX();
			crystal.y = randomY();
			this._crystals.push(crystal);
		}
	}
	,
	onAct: function(tickEvent) {
		// Check for player-collisions:

		var playerGraphics = this.game.player.playerGraphics;
		var minDistance = Balance.player.radius + Balance.crystals.radius;
		var i = this._crystals.length;
		while (i--) {
			var crystal = this._crystals[i];
			var dx = crystal.x - playerGraphics.x, dy = crystal.y - playerGraphics.y;
			var distance = Math.sqrt(dx*dx+dy*dy);
			if (distance < minDistance) {
				this.addAnimation(
					new Animation()
					.duration(2).ease()
					.move({ target: crystal, to: playerGraphics })
				);
				this._crystals.splice(i, 1);
			}
		}


		this.updateAnimations(tickEvent.deltaSeconds);

	}
	,
	onDraw: function(tickEvent) {

	}
});