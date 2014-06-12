XQuestGame.HUD = Smart.Class({
	initialize: function(game) {
		this.game = game;
		this._setupGraphics();
		this._layout();
	}
	, _setupGraphics: function() {

		this.hudOverlay = this.game.gfx.createHUDOverlay();

		this.hudLivesIcon = this.game.gfx.createPlayerHUDIcon();
		this.hudLivesText = this.game.gfx.addText("", 'hudText');

		this.hudCrystalsIcon = this.game.gfx.createCrystalHUDIcon();
		this.hudCrystalsText = this.game.gfx.addText("", 'hudText');
	}
	,
	_layout: function() {
		var bounds = Balance.level.bounds, middle = bounds.hudHeight / 2;
		var padding = 20, margin = 50;

		var leftPos = padding;

		leftPos += this.hudLivesIcon.radius;
		this.hudLivesIcon.moveTo(leftPos, middle);
		leftPos += this.hudLivesIcon.radius;
		this.hudLivesText.moveTo(leftPos, middle);

		leftPos += margin;

		leftPos += this.hudCrystalsIcon.radius;
		this.hudCrystalsIcon.moveTo(leftPos, middle);
		leftPos += this.hudCrystalsIcon.radius;
		this.hudCrystalsText.moveTo(leftPos, middle);

		leftPos += margin;



	}
	,
	onDraw: function(tickEvent) {
		this.hudLivesText.text = ' x ' + this.game.stats.lives;
		this.hudCrystalsText.text = ' x ' + this.game.stats.crystalCount;
	}

});