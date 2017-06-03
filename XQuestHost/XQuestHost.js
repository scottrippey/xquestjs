XQuestGame.XQuestHost = Smart.Class(new Smart.Disposable(), {
	initialize(canvas) {
		Balance.setGameMode('arcade');

		this._setupCanvas(canvas);
		this._setupTimer();
		this._setupSettings();

		this._setupGamepad();

		this._startHostScene();
	},

	_setupCanvas(canvas) {
		if (!canvas) {
			var bounds = Balance.level.bounds;
			canvas = this._createFullScreenCanvas(bounds.visibleWidth, bounds.visibleHeight);
		}
		this.canvas = canvas;
	},
	_createFullScreenCanvas(canvasWidth, canvasHeight) {
		// Create elements manually, because parsing isn't "safe" for WinJS:
		var container = document.createElement('section'), canvas = document.createElement('canvas');
		container.appendChild(canvas);
		container.setAttribute('tabindex', '1');
		_.extend(container.style, { position: 'fixed', top: 0, left: 0, bottom: 0, right: 0, backgroundColor: 'hsl(0, 0%, 5%)', outline: 'none' });
		_.extend(canvas.style, { position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, margin: 'auto' });

		canvas.width = canvasWidth;
		canvas.height = canvasHeight;

		document.body.appendChild(container);
		document.body.style.overflow = "hidden";
		this.onDispose(() => {
			document.body.removeChild(container);
			document.body.style.overflow = null;
		});
		container.focus();

		this._contain(container, canvas, canvasWidth, canvasHeight);

		this.canvas = canvas;
		this.container = container;

		return canvas;
	},
	_contain(container, canvas, canvasWidth, canvasHeight) {
		window.addEventListener('resize', scaleCanvas);
		this.onDispose(() => {
			window.removeEventListener('resize', scaleCanvas);
		});
		scaleCanvas();

		function scaleCanvas() {
			var containerWidth = container.offsetWidth, containerHeight = container.offsetHeight;
			var canvasWidthRatio = (canvasWidth / canvasHeight), containerWidthRatio = (containerWidth / containerHeight);
			if (canvasWidthRatio > containerWidthRatio) {
				canvas.style.width = `${containerWidth}px`;
				canvas.style.height = `${containerWidth / canvasWidthRatio}px`;
			} else {
				canvas.style.height = `${containerHeight}px`;
				canvas.style.width = `${containerHeight * canvasWidthRatio}px`;
			}
		}
	},

	_setupTimer() {
		this.timer = new EaselJSTimer();
		this.timer.addTickHandler(this._tickHandler.bind(this));
		this.onDispose(function() {
			this.timer.dispose();
		});
	},
	_tickHandler(tickEvent) {
		// timeAdjust is currrently unused, but can be set in the console for testing purposes
		if (this.timeAdjust) {
			tickEvent.deltaSeconds *= this.timeAdjust;
		}

		this.hostScene.updateScene(tickEvent);
	},

	_setupSettings() {
		this.settings = new XQuestGame.XQuestHost.Settings();
	},

	_setupGamepad() {
		this.gamepadInput = XQuestInput.PlayerInputGamepad.createGamepadInput() || null;
		if (this.gamepadInput) {
			this.onDispose(function() {
				this.gamepadInput.dispose();
			});
		}
	},

	_startHostScene() {
		var graphics = new EaselJSGraphics(this.canvas);
		this.hostScene = new XQuestGame.HostScene(graphics, this.settings);

		// Setup Inputs:
		this.hostScene.onMenuCreated(this._addMenuInputs.bind(this));
		this.hostScene.onGameCreated(this._addPlayerInputs.bind(this));
		this.hostScene.onQuitGame(() => {
			this.dispose();
		});


		this.hostScene.start();

		this.onDispose(function() {
			this.hostScene.dispose();
		});

	},
	_addMenuInputs(menuScene) {
		menuScene.addSceneItem(new XQuestInput.MenuInputKeyboard(null));
		if (this.gamepadInput) {
			menuScene.addSceneItem(this.gamepadInput);
		}
	},
	_addPlayerInputs(arcadeGame) {
		arcadeGame.addSceneItem(new XQuestInput.PlayerInputKeyboard(arcadeGame, null, this.settings));
		arcadeGame.addSceneItem(new XQuestInput.PlayerInputMouse(arcadeGame, this.canvas.parentNode, this.settings));
		arcadeGame.addSceneItem(new XQuestInput.PlayerInputTouch(arcadeGame, this.canvas.parentNode, this.settings));
		if (this.gamepadInput) {
			arcadeGame.addSceneItem(this.gamepadInput);
			this.gamepadInput.setGame(arcadeGame);
		}
	},

	enterFullScreen() {
    requestFullscreen(this.container);
  }

});

function requestFullscreen(elem) {
  (
  		elem.requestFullscreen
      || elem.webkitRequestFullscreen
      || elem.mozRequestFullScreen
      || elem.msRequestFullscreen
  ).call(elem);
}
