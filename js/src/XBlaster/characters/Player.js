var Player = new Class({

	initialize: function(game) {
		this.game = game;
		this.velocity = { x: 0, y: 0 };

		this._setupPlayerGraphics();
	}
	, _setupPlayerGraphics: function() {
		this.playerGraphics = this.game.gfx.createPlayerGraphics();
		this.playerGraphics.moveTo(100, 100);
	}

	, onInput: function(tickEvent) {
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
					return false; // unhandled
			}
			return true;
		});
	}

	, onMove: function(tickEvent) {
		Physics.applyVelocity(this.playerGraphics, this.velocity, tickEvent.deltaSeconds);
		if (this.inputResults.acceleration) {
			Physics.applyAcceleration(this.playerGraphics, this.inputResults.acceleration, tickEvent.deltaSeconds);
			Physics.applyAccelerationToVelocity(this.velocity, this.inputResults.acceleration);
		}
	}


	, onAct: function(tickEvent) {

	}
});