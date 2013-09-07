
angular.module("XQuestUI").controller("XQuestUIController", [
	'$scope', '$window', '$document', function XQuestUIController($scope, $window, $document) {
		_.extend(this, {
			currentGame: null
			, previousMousePosition: null
			, windowSize: null
			, engaged: false
			, initialize: function() {
				this._setupWindowSize();
			}
			, _setupWindowSize: function() {
				angular.element($window).bind('resize', this._onWindowResize.bind(this));
				this._onWindowResize();
			}
			, _onWindowResize: function() {
				var clientArea = $document[0].html;
				this.windowSize = { width: clientArea.clientWidth, height: clientArea.clientHeight };
			}

			, onMouseMove: function(event) {
				if (!this.currentGame)
					return;

				var mousePosition = { x: event.clientX, y: event.clientY };
				var delta = this._updateMousePosition(mousePosition);
				if (!delta)
					return;

				var acceleration = this._adjustForSensitivity(delta, mousePosition, this.windowSize);

				this.currentGame.input.accelerate(acceleration);
			}
			, _updateMousePosition: function(mousePosition) {
				var delta = null;
				if (this.previousMousePosition) {
					delta = {
						x: mousePosition.x - this.previousMousePosition.x
						, y: mousePosition.y - this.previousMousePosition.y
					};
				}
				this.previousMousePosition = mousePosition;

				return delta;
			}
			, _adjustForSensitivity: function(delta, mousePosition, windowSize) {
				var sensitivity = 3
					, biasSensitivity = 2;

				var distanceFromCenter = {
					x: 2 * ((mousePosition.x / windowSize.width) - 0.5)
					, y: 2 * ((mousePosition.y / windowSize.height) - 0.5)
				};

				var bias = {
					x: this._getBias(distanceFromCenter.x, delta.x, biasSensitivity)
					, y: this._getBias(distanceFromCenter.y, delta.y, biasSensitivity)
				};
				var acceleration = {
					x: delta.x * sensitivity * bias.x
					, y: delta.y * sensitivity * bias.y
				};
				return acceleration;
			}
			, _getBias: function(distanceFromCenter, deltaDirection, sensitivity) {
				// "Bias" is used to increase outward sensitivity, and decrease inward sensitivity.
				// This causes the user's mouse to gravitate toward the center of the page,
				// decreasing the likelihood of reaching the edges of the page.

				var isMovingAwayFromCenter = (distanceFromCenter < 0 && deltaDirection < 0) || (distanceFromCenter > 0 && deltaDirection > 0);
				distanceFromCenter = Math.abs(distanceFromCenter);
				if (isMovingAwayFromCenter) {
					return 1 + distanceFromCenter * (sensitivity - 1);
				} else {
					return 1 - distanceFromCenter + (distanceFromCenter / sensitivity);
				}
			}

			, engage: function() {
				if (this.currentGame) {
					this.currentGame.input.engage();
					this.engaged = true;
				}

				this.previousMousePosition = null;
			}

			, disengage: function(event) {
				if (this.currentGame) {
					this.currentGame.input.disengage();
				}

				this.engaged = false;
				this.previousMousePosition = null;
			}

			, primaryWeapon: function() {
				if (this.currentGame)
					this.currentGame.input.primaryWeapon();
			}

			, registerCanvas: function(canvas) {
				this.canvas = canvas;
			}

			, startGame: function() {
				var canvas = this.canvas;

				var xquest = new XQuest(canvas);

				this.currentGame = xquest.game;

				this.engaged = true;
				this.fillscreen = true;
			}

		});

		this.initialize();
	}
]);

