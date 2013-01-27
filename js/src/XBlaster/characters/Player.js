var Player = new Class({
	initialize: function(game) {
		this.game = game;

		this._setupPlayerGraphics();
	}
	, _setupPlayerGraphics: function() {
		this.playerGraphics = playerGraphics;

		this.game.gfx.addToStage(this.playerGraphics);
	}
	, moveTo: function(point) {
		Physics.setPosition(this.playerGraphics, point.x, point.y);
	}
});