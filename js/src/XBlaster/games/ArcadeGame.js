var ArcadeGame = new Class({

	gfx: null
	, input: null

	, initialize: function(gfx, input) {
		this.gfx = gfx;
		this.input = input;

		this.input.onInput(this._onInput.bind(this));
	}
	, start: function() {
		this.gfx.startTimer();

		this.player = new Player(this);
	}
	, _onInput: function(action, data) {
		switch (action) {
			case 'movePlayer':
				var position = data;
				this.player.moveTo(position);
				break;
		}
	}

});
