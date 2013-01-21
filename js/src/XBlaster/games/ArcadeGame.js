define('ArcadeGame',
	[ 'Game' ]
	,
	function(Game){

	var ArcadeGame = new Class({
		Extends: Game

		, gfx: null
		, input: null

		, initialize: function(gfx, input) {
			this.gfx = gfx;
			this.input = input;
		}

	});

	return ArcadeGame;
});