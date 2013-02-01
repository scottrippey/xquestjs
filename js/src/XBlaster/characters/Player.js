var Player = new Class({

	variables: {
		looseFriction: 0.5
		, bulletSpeed: 2
	}
	, bullets: []

	, initialize: function(game) {
		this.game = game;
		this.velocity = { x: 0, y: 0 };
		this.engaged = false;

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
			, primaryWeapon: 0
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
					results.primaryWeapon += 1;
					break;
				case 'secondaryWeapon':
					results.secondaryWeapon = true;
					break;
				default:
					return false; // unhandled
			}
			return true;
		});

		this._analyzeInput();
	}
	, _analyzeInput: function() {
		if (this.inputResults.engaged !== this.engaged) {
			this.engaged = this.inputResults.engaged;
		}

		var i = this.inputResults.primaryWeapon;
		while (i--) {
			this._addBullet(i);
		}
	}
	, _addBullet: function(index) {
		var bulletGfx = this.game.gfx.createPlayerBullet();
		bulletGfx.moveTo(this.playerGraphics.x, this.playerGraphics.y);
		bulletGfx.velocity = {
			x: this.velocity.x * this.variables.bulletSpeed
			, y: this.velocity.y * this.variables.bulletSpeed
		};
		this.bullets.push(bulletGfx);
	}

	, onMove: function(tickEvent) {
		Physics.applyVelocity(this.playerGraphics, this.velocity, tickEvent.deltaSeconds);
		if (this.inputResults.acceleration) {
			Physics.applyAcceleration(this.playerGraphics, this.inputResults.acceleration, tickEvent.deltaSeconds);
			Physics.applyAccelerationToVelocity(this.velocity, this.inputResults.acceleration);
		}
		if (!this.engaged) {
			Physics.applyFrictionToVelocity(this.velocity, this.variables.looseFriction, tickEvent.deltaSeconds);
		}

		this.bullets.each(function(bulletGfx) {
			Physics.applyVelocity(bulletGfx, bulletGfx.velocity, tickEvent.deltaSeconds);
		});
	}


	, onAct: function(tickEvent) {

	}
});