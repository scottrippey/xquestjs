XQuestGame.Hud = Smart.Class({
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

		this.hudBombsIcon = this.game.gfx.createBombCrystalHUDIcon();
		this.hudBombsText = this.game.gfx.addText("", 'hudText');
		
		this.hudPauseButton = this.game.gfx.createPauseButtonHUD();
		this.hudPauseButton.addEventListener('click', function() { this.game.pauseGame(); }.bind(this));
	}
	,
	_layout: function() {
		var bounds = Balance.level.bounds, middle = bounds.hudHeight / 2;
		var spacer = 50;

		var leftPos = spacer;

		leftPos += this.hudLivesIcon.radius;
		this.hudLivesIcon.moveTo(leftPos, middle);
		leftPos += this.hudLivesIcon.radius;
		this.hudLivesText.moveTo(leftPos, middle);

		leftPos += spacer;

		leftPos += this.hudCrystalsIcon.radius;
		this.hudCrystalsIcon.moveTo(leftPos, middle);
		leftPos += this.hudCrystalsIcon.radius;
		this.hudCrystalsText.moveTo(leftPos, middle);

		leftPos += spacer;

		leftPos += this.hudBombsIcon.radius;
		this.hudBombsIcon.moveTo(leftPos, middle);
		leftPos += this.hudBombsIcon.radius;
		this.hudBombsText.moveTo(leftPos, middle);

		leftPos += spacer;

		
		var center = bounds.visibleWidth / 2;
		this.hudPauseButton.moveTo(center - this.hudPauseButton.width / 2, middle - this.hudPauseButton.height / 2);

	}
	,
	onDraw: function(tickEvent) {
		this.hudLivesText.text = ' x ' + this.game.stats.lives;
		this.hudCrystalsText.text = ' x ' + this.game.stats.crystalCount;
		this.hudBombsText.text = ' x ' + this.game.stats.bombs;
	}

});