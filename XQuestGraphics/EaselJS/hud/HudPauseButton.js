Balance.onUpdate(gameMode => {
	Graphics.merge({
		hudGraphics: {
			button: {
				padding: 5
				, cornerRadius: 4
				, style: {
					strokeWidth: 1, strokeColor: 'hsla(0, 100%, 100%, 0.3)',
					fillColor: 'hsla(0, 100%, 100%, 0.1)'
				}
			}
			, pauseButton: { width: 50 + 22 + 8, height: 20 + 8 }
			, pauseIcon: {
				style: { fillColor: 'hsla(0, 100%, 100%, 0.2)' },
				rectWidth: 8, rectHeight: 20, iconWidth: 22, rectRadius: 2
			}
			, sandwichIcon: {
				style: { fillColor: 'hsla(0, 100%, 100%, 0.2)' },
				rectWidth: 20, rectHeight: 4, iconHeight: 15, rectRadius: 2
			}
		}
	});
});

EaselJSGraphics.HudGraphics.HudButton = Smart.Class(new createjs.Container(), {
	Container_initialize: createjs.Container.prototype.initialize
	, 
	HudButton_initialize(gfx, width, height) {
		this.gfx = gfx;
		this.Container_initialize();
		this.width = width;
		this.height = height;
		this._setupButtonBackground();
	}
	,
	_setupButtonBackground() {
		var button = Graphics.hudGraphics.button;
		
		var background = new createjs.Shape();
		background.graphics.clear()
			.beginStyle(button.style)
			.drawRoundRect(0, 0, this.width, this.height, button.cornerRadius)
			.endStyle(button.style)
		;
		
		
		this.addChild(background);
	}
});

EaselJSGraphics.HudGraphics.HudPauseButton = Smart.Class(new EaselJSGraphics.HudGraphics.HudButton(), {
	initialize(gfx) {
		var pauseButton = Graphics.hudGraphics.pauseButton;
		this.HudButton_initialize(gfx, pauseButton.width, pauseButton.height);
		
		this._setupGraphics();
	}
	, _setupGraphics() {
		var pauseButton = Graphics.hudGraphics.pauseButton;
		
		var text = this._createText();
		text.textAlign = 'right';
		text.moveTo(pauseButton.width / 2, pauseButton.height / 2);
		this.addChild(text);
		
		var icon = this._createSandwichIcon();
		var padding = (pauseButton.height - icon.height) / 2;
		icon.moveTo((pauseButton.width - icon.width) - padding, padding);
		this.addChild(icon);
		
	}
	, _createText() {
		var pauseButton = Graphics.hudGraphics.pauseButton;
		var pauseText = new EaselJSGraphics.TextGraphic();
		pauseText.setText("Pause", 'hudText');
		
		this.addChild(pauseText);
		return pauseText;
	}
	, _createPauseIcon() {
		var pauseIcon = Graphics.hudGraphics.pauseIcon;
		var icon = new createjs.Shape();
		icon.graphics
			.beginStyle(pauseIcon.style)
			.drawRoundRect(0, 0, pauseIcon.rectWidth, pauseIcon.rectHeight, pauseIcon.rectRadius)
			.drawRoundRect(pauseIcon.iconWidth - pauseIcon.rectWidth, 0, pauseIcon.rectWidth, pauseIcon.rectHeight, pauseIcon.rectRadius)
			.endStyle(pauseIcon.style)
		;
		
		this.addChild(icon);
		return icon;
	}
	, _createSandwichIcon() {
		var sandwichIcon = Graphics.hudGraphics.sandwichIcon;
		var bottomRow = (sandwichIcon.iconHeight - sandwichIcon.rectHeight),
			middleRow = (sandwichIcon.iconHeight - sandwichIcon.rectHeight) / 2;
		var icon = new createjs.Shape();
		icon.graphics
			.beginStyle(sandwichIcon.style)
			.drawRoundRect(0, 0, sandwichIcon.rectWidth, sandwichIcon.rectHeight, sandwichIcon.rectRadius)
			.drawRoundRect(0, middleRow, sandwichIcon.rectWidth, sandwichIcon.rectHeight, sandwichIcon.rectRadius)
			.drawRoundRect(0, bottomRow, sandwichIcon.rectWidth, sandwichIcon.rectHeight, sandwichIcon.rectRadius)
			.endStyle(sandwichIcon.style)
		;
		icon.width = sandwichIcon.rectWidth;
		icon.height = sandwichIcon.iconHeight;
		
		this.addChild(icon);
		return icon;
	}
});