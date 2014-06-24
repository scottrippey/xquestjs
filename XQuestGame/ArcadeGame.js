(function() {
	var GameEvents = {
		onNewGame: 'NewGame'
		,onNewLevel: 'NewLevel'
		,onPlayerKilled: 'PlayerKilled'
		,onGameOver: 'GameOver'
		,onNextLevel: 'NextLevel'
		,onAllCrystalsGathered: 'AllCrystalsGathered'
		,onGamePaused: 'GamePaused'
		,onPowerupChanged: 'PowerupChanged'
	};

	XQuestGame.ArcadeGame = Smart.Class(new XQuestGame.BaseScene(), {
		player: null
		, levelGraphics: null
		, activePowerups: null
		, scenePaused: false
		, stats: null
		, powerCrystals: null
		
		, initialize: function _ArcadeGame(graphics) {
			this.BaseScene_initialize();
			this.gfx = graphics;
			
			// Since all other classes use 'this.game', this will provide consistency:
			this.game = this;
			this._events = new Smart.Events();
	
			this.addSceneItem(this);
	
			this.stats = {};
			this._setupLevelGraphics();
			this._setupPlayer();
			this._setupEnemyFactory();
			this._setupCrystals();
			this._setupPowerCrystals();
			this._setupProjectiles();
			this._setupHUD();

			this.activePowerups = {};
	
			this._startGame();
		}
		, _setupLevelGraphics: function() {
			this.levelGraphics = this.game.gfx.createLevelGraphics();
		}
		, _setupPlayer: function() {
			this.player = new XQuestGame.Player(this.game);
			this.game.addSceneItem(this.player);
		}
		, _setupEnemyFactory: function() {
			this.enemies = new XQuestGame.EnemyFactory(this.game);
			this.addSceneItem(this.enemies);
		}
		, _setupCrystals: function() {
			this.crystals = new XQuestGame.CrystalFactory(this.game);
		}
		, _setupPowerCrystals: function() {
			this.powerCrystals = new XQuestGame.PowerupFactory(this.game);
		}
		, _setupProjectiles: function() {
			this.projectiles = new XQuestGame.Projectiles(this.game);
		}
		, _setupHUD: function() {
			this.hud = new XQuestGame.Hud(this.game);
			this.addSceneItem(this.hud);
		}
		
		, debug: function() {
			var debug = new XQuestGame.GameDebugger(this.game);
			this.debug = function() { return debug; };
			return this.debug();
		}
	
		, _startGame: function() {
			this.currentLevel = 1;
			this.stats.lives = Balance.player.lives;
			this.stats.bombs = Balance.bombs.startCount;
	
			this._events.fireEvent(GameEvents.onNewGame);
			
			this._showLevelNumber();
			this._arrangeNewLevel();
			this._startLevel();
		}
		, _showLevelNumber: function() {
			var level = "Level " + this.currentLevel;
	
			var textGfx = this.game.gfx.addText(level, { textBaseline: 'top' });
			textGfx.flyIn(1.5).flyOut(2);
		}
		, _arrangeNewLevel: function() {
			this.game.levelGraphics.closeGate();
			this.game.levelGraphics.setGateWidth(Balance.level.gateWidth);
	
			this._events.fireEvent(GameEvents.onNewLevel);
			this.game.crystals.startLevel();
			this.game.enemies.startLevel();
			this.game.powerCrystals.startLevel();
		}
		, _startLevel: function() {
			var middleOfGame = this.game.gfx.getGamePoint('middle');
			this.game.player.movePlayerTo(middleOfGame.x, middleOfGame.y);
			this.game.player.cancelVelocity();
			this.game.player.showPlayer(true);
	
			this.followPlayer = true;
		}
	
		, onAct: function(tickEvent) {
			this._updateActivePowerups(tickEvent);
	
			if (this.followPlayer)
				this.game.gfx.followPlayer(this.game.player.location);
	
		}
	
		, getDefaultInputState: function() {
			var state = {
				primaryWeapon: false
				, secondaryWeapon: false
				, engaged: false
				, accelerationX: 0
				, accelerationY: 0
			};
			return state;
		}
	
		, killPlayer: function() {
			this.game.player.killPlayer();
			this._events.fireEvent(GameEvents.onPlayerKilled);
			this.game.enemies.clearAllEnemies();
			this.game.powerCrystals.clearAllPowerCrystals();
	
			if (this.game.stats.lives === 0) {
				this._gameOver();
			} else {
				this._loseALife();
			}
		}
		, _loseALife: function() {
			this.game.stats.lives--;
			this._animateBackToCenter().queue(function() {
				this._startLevel();
			}.bind(this));
		}
		, _gameOver: function() {
			// bew wew wew wew wew
			this._animateBackToCenter();
			
			this._events.fireEvent(GameEvents.onGameOver);
	
			this.game.gfx.addAnimation(new Smart.Animation()
				.queue(function() {
					this.game.gfx.addText("Game Over").flyIn(2).delay(2).flyOut(2);
				}.bind(this)).delay(5)
				.queue(function() {
					this.game.gfx.addText("Highest Level: " + this.currentLevel).flyIn(2).delay(2).flyOut(2);
				}.bind(this)).delay(5)
				.queue(function() {
					this.game.gfx.addText("Starting a new game in 5 seconds...").flyIn(2).delay(2).flyOut(2);
				}.bind(this)).delay(5)
				.queue(function() {
					this._startGame();
				}.bind(this))
			);
	
		}
	
		, levelUp: function() {
			this.game.player.showPlayer(false);
						
			// Let's kill all enemies:
			this.game.enemies.killAllEnemies();
			this.game.powerCrystals.clearAllPowerCrystals();
	
			this.currentLevel++;
	
			this._showLevelNumber();
			this._arrangeNewLevel();
			this._animateBackToCenter().queue(function() {
				this._startLevel();
			}.bind(this));
			
			this._events.fireEvent(GameEvents.onNextLevel);
		}
		, _animateBackToCenter: function() {
			var visibleMiddle = this.game.gfx.getGamePoint('visibleMiddle')
				, middleOfGame = this.game.gfx.getGamePoint('middle');
	
			this.followPlayer = false;
			var animation = new Smart.Animation()
				.duration(2).ease()
				.tween(function(p) {
					this.game.gfx.followPlayer(p);
				}.bind(this), Smart.Keyframes.fromPoints([ visibleMiddle, middleOfGame ]));
			this.game.gfx.addAnimation(animation);
			return animation;
		}
	
		, crystalsGathered: function(remainingCrystals, gatheredCrystals) {
			if (remainingCrystals === 0) {
				this.game.levelGraphics.openGate();
				this._events.fireEvent(GameEvents.onAllCrystalsGathered);
			}
		}
	
		, pauseGame: function(paused) {
			paused = (paused !== undefined) ? paused : !this.scenePaused;
			
			if (this.scenePaused === paused) return;
			this.scenePaused = paused;
			
			this.game.player.cancelVelocity();
			
			this._events.fireEvent(GameEvents.onGamePaused, [ this.scenePaused ]);
		}
	
		, activatePowerup: function(powerupName) {
			this.game.activePowerups[powerupName] = 'newPowerup';
	
			var powerupDisplayName = powerupName + "!";
			var textGfx = this.game.gfx.addText(powerupDisplayName, 'powerupActive');
			textGfx.start('left').flyIn(1.5, 'middle').flyOut(2, 'right');
			
			this._events.fireEvent(GameEvents.onPowerupChanged, [ powerupName, true ]);
		}
		, powerupDeactivated: function(powerupName) {
			this._events.fireEvent(GameEvents.onPowerupChanged, [ powerupName, false ]);
			var powerupDisplayName = powerupName + " inactive";
			var textGfx = this.game.gfx.addText(powerupDisplayName, 'powerupDeactive');
			return textGfx.start('left').flyIn(1.5, 'middle').flyOut(2, 'right');
		}
		, _updateActivePowerups: function(tickEvent) {
			var B = Balance.powerups;
			var updatedValues = {};
			var deactivating = 'deactivating';
			
			// Update new and old powerups: (never make changes to an object while iterating)
			_.forOwn(this.game.activePowerups, function(powerupValue, powerupName) {
				if (powerupValue === 'newPowerup') {
					// New
					var powerupExpires = tickEvent.runTime + B[powerupName].duration * 1000;
					updatedValues[powerupName] = powerupExpires;
				} else if (powerupValue === deactivating) {
					// Old
				} else if (powerupValue <= tickEvent.runTime) {
					// Expired
					updatedValues[powerupName] = deactivating;
				}
			});
			_.forOwn(updatedValues, function(updatedValue, powerupName) {
				if (updatedValue === deactivating) {
					this.game.powerupDeactivated(powerupName).queue(function() {
						delete this.game.activePowerups[powerupName];
					}.bind(this));
				}
				this.game.activePowerups[powerupName] = updatedValue;
			}, this);
	
		}

		, toggleFPS: function() {
			if (this.fpsText) {
				this.fpsText.dispose();
				this.fpsText = null;
			} else {
				var textStyle = { color: 'red', fontSize: "40px", textAlign: 'left', textBaseline: 'top' };
				this.fpsText = this.game.gfx.addText("FPS", textStyle);
				this.fpsText.moveTo(0, 0);
				this.fpsText.onTick = function(tickEvent) {
					var actualFPS = createjs.Ticker.getMeasuredFPS()
						,potentialFPS = 1000 / createjs.Ticker.getMeasuredTickTime();

					this.text = "FPS: " + potentialFPS.toFixed(2) + " [" + actualFPS.toFixed(2) + "]";
				};
			}
		}
		, toggleDebugStats: function() {
			if (this.debugStatsText) {
				this.debugStatsText.dispose();
				this.debugStatsText = null;
			} else {
				var textStyle = { color: 'red', fontSize: "40px", textAlign: 'right', textBaseline: 'top' };
				this.debugStatsText = this.game.gfx.addText("FPS", textStyle);

				var bounds = Balance.level.bounds;
				this.debugStatsText.moveTo(bounds.visibleWidth, 0);


				var gameItems = this.game.debugStats.gameItems
					,allGraphics = this.game.gfx.debugStats.allGraphics;
				this.debugStatsText.onTick = function(tickEvent) {
					this.text = "Game Items: " + gameItems.length + "\nGraphics: " + allGraphics.length;
				};
			}
		}

	});
	
	// Add event handler functions to ArcadeGame, so that we don't use addEvent / fireEvent directly
	_.forOwn(GameEvents, function(eventName, onEventName) {
		XQuestGame.ArcadeGame.prototype[onEventName] = function(eventHandler) {
			this._events.addEvent(eventName, eventHandler);
		};
	});
	
})();
