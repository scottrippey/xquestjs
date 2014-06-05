var XQuestHost = Smart.Class({
	initialize: function(canvas) {
		
		if (!canvas) {
			var bounds = Balance.level.bounds;
			canvas = this._createFullScreenCanvas(bounds.visibleWidth, bounds.visibleHeight);
		}

		var graphics = new EaselJSGraphics(canvas);

		this.game = new ArcadeGame(graphics);

		new XQuestInput.KeyboardInput(this.game, null);
		new XQuestInput.MouseInput(this.game, canvas.parentNode);
	},
	
	_createFullScreenCanvas: function(canvasWidth, canvasHeight) {
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
	},
	_contain: function(container, canvas, canvasWidth, canvasHeight) {
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
	

});