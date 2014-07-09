XQuestGame.XQuestHost = Smart.Class(new Smart.Disposable(), {
	initialize: function(canvas) {
		
		this.scenes = [];

		Balance.setGameMode('arcade');

		this._setupCanvas(canvas);
		this._setupTimer();

		this._setupBackgroundGraphics();
		this._setupMenuScene();
		
		this._loadStartMenu();
	}

	,_setupCanvas: function(canvas) {
		if (!canvas) {
			var bounds = Balance.level.bounds;
			canvas = this._createFullScreenCanvas(bounds.visibleWidth, bounds.visibleHeight);
		}
		this.canvas = canvas;
	}
	,_createFullScreenCanvas: function(canvasWidth, canvasHeight) {
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
		this.onDispose(function() {
			document.body.removeChild(container);
			document.body.style.overflow = null;
		});
		container.focus();

		this._contain(container, canvas, canvasWidth, canvasHeight);

		return canvas;
	}
	,_contain: function(container, canvas, canvasWidth, canvasHeight) {
		window.addEventListener('resize', scaleCanvas);
		this.onDispose(function() {
			window.removeEventListener('resize', scaleCanvas);
		});
		scaleCanvas();

		function scaleCanvas() {
			var containerWidth = container.offsetWidth, containerHeight = container.offsetHeight;
			var canvasWidthRatio = (canvasWidth / canvasHeight), containerWidthRatio = (containerWidth / containerHeight);
			if (canvasWidthRatio > containerWidthRatio) {
				canvas.style.width = containerWidth + 'px';
				canvas.style.height = (containerWidth / canvasWidthRatio) + 'px';
			} else {
				canvas.style.height = containerHeight + 'px';
				canvas.style.width = (containerHeight * canvasWidthRatio) + 'px';
			}
		}
	}

	,_setupTimer: function() {
		this.timer = new EaselJSTimer();
		this.timer.addTickHandler(this._tickHandler.bind(this));
		this.onDispose(function() {
			this.timer.dispose();
		}.bind(this));
	}
	,_tickHandler: function(tickEvent) {
		// timeAdjust is currrently unused, but can be set in the console for testing purposes
		if (this.timeAdjust) {
			tickEvent.deltaSeconds *= this.timeAdjust;
		}
		
		this.backgroundGraphics.onDraw(tickEvent);
		this.scenes.forEach(function(scene) {
			scene.updateScene(tickEvent);
		});
	}
	,_setupBackgroundGraphics: function() {
		this.backgroundGraphics = new EaselJSGraphics(this.canvas);
	}

	,_setupMenuScene: function() {
		var host = this;
		var graphics = new EaselJSGraphics(this.canvas);
		graphics.showBackgroundStars(true);
		this.menuScene = new XQuestGame.MenuScene(graphics, host);
		this.menuScene.addSceneItem(new XQuestInput.MenuInputKeyboard());
		this.scenes.push(this.menuScene);
	}
	,_loadStartMenu: function() {
		var startMenu = new XQuestGame.CommonMenus.StartMenu(this.menuScene);
		this.menuScene.addMenu(startMenu);
		
		startMenu.onStartGame(this._startArcadeGame.bind(this));
	}
	
	,_startArcadeGame: function() {
		
		// Create Game:
		var graphics = new EaselJSGraphics(this.canvas);
		graphics.showBackgroundStars(true);
		this.game = new XQuestGame.ArcadeGame(graphics);
				
		// Game Inputs:
		this.game.addSceneItem(new XQuestInput.PlayerInputKeyboard(this.game, null));
		this.game.addSceneItem(new XQuestInput.PlayerInputMouse(this.game, this.canvas.parentNode));
		this.game.addSceneItem(new XQuestInput.PlayerInputTouch(this.game, this.canvas.parentNode));
		// Game Events:
		this.game.onGamePaused(this._showPauseMenu.bind(this));
		
		this.game.startArcadeGame();

		// Put the menu over the game:
		this.scenes = [ this.game, this.menuScene ];
		this.menuScene.gfx.showBackgroundStars(false);
		
	}
	,X_showPauseMenu: function(paused) {
		if (!paused) return;
		// Create Pause Menu:
		// Currently there can only be 1 scene that uses this.graphics;
		// otherwise we would be double-drawing everything:
		var graphics = new EaselJSGraphics(this.canvas);
		this.pauseMenu = new XQuestGame.PauseMenu(graphics);
		this.scenes.push(this.pauseMenu);
		// Menu Inputs:
		this.pauseMenu.addSceneItem(new XQuestInput.MenuInputKeyboard());
		// Menu Events:
		this.pauseMenu.onMenuExit(function() {
			this.scenes.pop();
			this.game.pauseGame(false);
		}.bind(this));
	}
	,_showPauseMenu: function(paused) {
		if (!paused) return;

		var pauseMenu = new XQuestGame.CommonMenus.PauseMenu(this.menuScene);
		this.menuScene.addMenu(pauseMenu);
		pauseMenu.onResumeGame(function() {
			this.game.pauseGame(false);
		}.bind(this));
	}	


});