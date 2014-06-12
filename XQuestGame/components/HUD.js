XQuestGame.HUD = Smart.Class({
	initialize: function(game) {
		this.game = game;
		this._setupGraphics();
	}
	, _setupGraphics: function() {

		this.hudOverlay = this.game.gfx.createHUDOverlay();

	}
});