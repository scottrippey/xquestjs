XQuestGame.XQuestHost = Smart.Class({
	initialize: function(canvas) {

		this.scenes = [];

		if (!canvas) {
			var bounds = Balance.level.bounds;
			canvas = this._createFullScreenCanvas(bounds.visibleWidth, bounds.visibleHeight);
		}

		this.canvas = canvas;

		this.graphics = new EaselJSGraphics(canvas);

		this._setupTimer();
		this._setupStartMenu();
	}
	,_createFullScreenCanvas: function(canvasWidth, canvasHeight) {
		var div = document.createElement('div');
		div.innerHTML =
			'<section style="position: fixed; top: 0; left: 0; bottom: 0; right: 0;">' +
			'<canvas style="position: absolute; top: 0; left: 0; bottom: 0; right: 0; margin: auto;"></canvas>' +
			'</section>';
		var container = div.childNodes[0], canvas = container.childNodes[0];
		canvas.setAttribute('width', canvasWidth);
		canvas.setAttribute('height', canvasHeight);

		document.body.appendChild(container);

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
	}
	,_tickHandler: function(tickEvent) {
		// Iterate right-to-left, because items could be removed
		this.scenes.forEach(function(scene) {
			scene.updateScene(tickEvent);
		});
	}

	,_setupStartMenu: function() {
		this.startMenu = new XQuestGame.StartMenu(this.graphics);
		this.startMenu.onStartArcadeGame(this._startArcadeGame.bind(this));
		this.scenes.push(this.startMenu);
	}

	,_startArcadeGame: function() {

		this.game = new XQuestGame.ArcadeGame(this.graphics);

		new XQuestInput.PlayerInputKeyboard(this.game, null);
		new XQuestInput.PlayerInputMouse(this.game, this.canvas.parentNode);
		new XQuestInput.PlayerInputTouch(this.game, this.canvas.parentNode);
	}



});