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
			x: this.velocity.x * this.variables.bulletSpeed
			, y: this.velocity.y * this.variables.bulletSpeed
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
			Physics.applyFrictionToVelocity(this.velocity, this.variables.looseFriction, tickEvent.deltaSeconds);
		}

		this._bounceOffWalls();
	}
	, _bounceOffWalls: function() {
		var bounds = this.game.level.bounds;
		var player = this.playerGraphics
			, velocity = this.velocity
			, diameter = this.playerGraphics.variables.outerDiameter;

		var leftEdge = (player.x - diameter) - (bounds.x)
			,rightEdge = (player.x + diameter) - (bounds.x + bounds.width);
		if (leftEdge < 0) {
			player.x -= leftEdge*2;
			velocity.x *= -1;
		} else if (rightEdge > 0) {
			player.x -= rightEdge*2;
			velocity.x *= -1;
		}
		var topEdge = (player.y - diameter) - (bounds.y)
			,bottomEdge = (player.y + diameter) - (bounds.y + bounds.height);
		if (topEdge < 0) {
			player.y -= topEdge*2;
			velocity.y *= -1;
		} else if (bottomEdge > 0) {
			player.y -= bottomEdge*2;
			velocity.y *= -1;
		}

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

	}
});