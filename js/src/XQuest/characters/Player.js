var Player = new Class({

	initialize: function(game) {
		this.game = game;
		this.velocity = { x: 0, y: 0 };
		this.engaged = false;
		this.bullets = [];

		this._setupPlayerGraphics();
	}
	, _setupPlayerGraphics: function() {
		this.playerGraphics = this.game.gfx.createPlayerGraphics();
	}
	, moveTo: function(x, y) {
		this.playerGraphics.moveTo(x, y);
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
			x: this.velocity.x * Balance.bullets.speed
			, y: this.velocity.y * Balance.bullets.speed
		};
		this.bullets.push(bulletGfx);
	}

	, onMove: function(tickEvent) {
		this._movePlayer(tickEvent);
		this._moveBullets(tickEvent);
	}
	, _movePlayer: function(tickEvent) {
		Physics.applyVelocity(this.playerGraphics, this.velocity, tickEvent.deltaSeconds);
		if (this.inputResults.acceleration) {
			Physics.applyAcceleration(this.playerGraphics, this.inputResults.acceleration, tickEvent.deltaSeconds);
			Physics.applyAccelerationToVelocity(this.velocity, this.inputResults.acceleration);
		}
		if (!this.engaged) {
			Physics.applyFrictionToVelocity(this.velocity, Balance.player.looseFriction, tickEvent.deltaSeconds);
		}

		Physics.bounceOffWalls(this.playerGraphics, Balance.player.diameter, this.velocity, this.game.level.bounds);
	}
	, _moveBullets: function(tickEvent) {
		var bounds = this.game.level.bounds, bullets = this.bullets, i = bullets.length;
		while (i--) {
			var bulletGfx = bullets[i];
			Physics.applyVelocity(bulletGfx, bulletGfx.velocity, tickEvent.deltaSeconds);
			if (!Physics.pointIsInBounds(bulletGfx, bounds)) {
				bulletGfx.destroyBullet();
				bullets.splice(i, 1);
			}
		}
	}


	, onAct: function(tickEvent) {
		if (this.bullets.length) {
			this.game.enemies.checkBullets(this.bullets);
		}
	}
});