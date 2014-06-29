XQuestGame.XQuestHost = Smart.Class(new Smart.Disposable(), {
	initialize: function(canvas) {
		
		this.scenes = [];

		Balance.setGameMode('arcade');

		this._setupCanvas(canvas);
		this._setupTimer();
		this._setupGraphics();
		this._setupStartMenu();
	}

	,_setupCanvas: function(canvas) {
		if (!canvas) {
			var bounds = Balance.level.bounds;
			canvas = this._createFullScreenCanvas(bounds.visibleWidth, bounds.visibleHeight);
		}
		this.canvas = canvas;
	}
	,_createFullScreenCanvas: function(canvasWidth, canvasHeight) {
		var div = document.createElement('div');
		div.innerHTML =
			'<section tabindex="1" style="position: fixed; top: 0; left: 0; bottom: 0; right: 0; background-color: hsl(0, 0%, 5%); outline: none; ">' +
			'<canvas style="position: absolute; top: 0; left: 0; bottom: 0; right: 0; margin: auto;"></canvas>' +
			'</section>';
		var container = div.childNodes[0], canvas = container.childNodes[0];
		canvas.setAttribute('width', canvasWidth);
		canvas.setAttribute('height', canvasHeight);

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
		scaleCanvas();

		function scaleCanvas() {
			var containerWidth = container.offsetWidth, containerHeight = container.offsetHeight;
			var fitWidth = (canvasWidth / canvasHeight > containerWidth / containerHeight);
			if (fitWidth) {
				canvas.style.width = "100%";
				canvas.style.height = "auto";
			} else {
				canvas.style.width = "auto";
				canvas.style.height = "100%";
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
		this.scenes.forEach(function(scene) {
			scene.updateScene(tickEvent);
		});
	}

	,_setupGraphics: function() {
		this.graphics = new EaselJSGraphics(this.canvas);
	}
	
	,_setupStartMenu: function() {
		// Create Start Menu:
		this.startMenu = new XQuestGame.StartMenu(this.graphics);
		this.scenes.push(this.startMenu);
		// Menu Inputs:
		this.startMenu.addSceneItem(new XQuestInput.MenuInputKeyboard());
		// Menu Events:
		this.startMenu.onStartArcadeGame(function() {
			this.scenes.pop();
			this._startArcadeGame();
		}.bind(this));
	}
	,_startArcadeGame: function() {
		// Create Game:
		this.game = new XQuestGame.ArcadeGame(this.graphics);
		this.scenes.push(this.game);
		// Game Inputs:
		this.game.addSceneItem(new XQuestInput.PlayerInputKeyboard(this.game, null));
		this.game.addSceneItem(new XQuestInput.PlayerInputMouse(this.game, this.canvas.parentNode));
		this.game.addSceneItem(new XQuestInput.PlayerInputTouch(this.game, this.canvas.parentNode));
		// Game Events:
		this.game.onGamePaused(this._showPauseMenu.bind(this));
		
		this.game.startArcadeGame();
	}
	,_showPauseMenu: function(paused) {
		if (!paused) return;
		// Create Pause Menu:
		// Currently there can only be 1 scene that uses this.graphics;
		// otherwise we would be double-drawing everything:
		var graphics = new EaselJSGraphics(this.canvas, true);
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


});