var Player = new Class({

	initialize: function(game) {
		this.game = game;

		this._setupPlayerGraphics();

	}
	, _setupPlayerGraphics: function() {
		this.playerGraphics = this.game.gfx.createPlayerGraphics();
		this.playerGraphics.moveTo(100, 100);

		this.velocity = { x: 0, y: 0 };
	}

	, input: function(tickEvent, game) {
		var results = this.inputResults = {
			acceleration: { x: 0, y: 0 }
			, engaged: this.engaged
		};

		this.game.input.processInputs(function(inputItem) {
			switch (inputItem.inputType) {
				case 'accelerate':
					results.acceleration.x += inputItem.x;
					results.acceleration.y += inputItem.y;
					break;
				case 'engage':
					results.engaged = true;
					break;
				case 'disengage':
					results.engaged = false;
					break;
				case 'primaryWeapon':
					results.primaryWeapon = true;
					break;
				case 'secondaryWeapon':
					results.secondaryWeapon = true;
					break;
				default:
					return false;
			}
			return true; // Handled
		});
	}

	, move: function(tickEvent, game) {
		Point.updatePositionFromVelocity(this.playerGraphics, this.velocity, tickEvent.deltaSeconds);
		Point.addPoints(this.velocity, this.inputResults.acceleration);
	}


	, act: function(tickEvent, game) {

	}
});