define('XBlaster'
	[ 'CanvasGraphics', 'ArcadeGame', 'BrowserInput' ]
	, function( CanvasGraphics, ArcadeGame, BrowserInput) {

		var XBlaster = new Class({
			initialize: function(canvas) {

				this.gfx = new CanvasGraphics(canvas);
				this.input = new BrowserInput(canvas);


				this.game = new ArcadeGame(this.gfx, this.input);
				this.game.start();
			}

		});

		return XBlaster;
	}
);