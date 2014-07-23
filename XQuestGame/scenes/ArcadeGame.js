(function() {
	var GameEvents = {
		onNewGame: 'onNewGame'
		,onNewLevel: 'onNewLevel'
		,onConfigureLevel: 'onConfigureLevel'
		,onPlayerKilled: 'onPlayerKilled'
		,onGameOver: 'onGameOver'
		,onNextLevel: 'onNextLevel'
		,onAllCrystalsGathered: 'onAllCrystalsGathered'
		,onGamePaused: 'onGamePaused'
	};

	XQuestGame.ArcadeGame = Smart.Class(new XQuestGame.BaseScene(), {
		player: null
		, levelGraphics: null
		, activePowerups: null
		, scenePaused: false
		, stats: null
		, powerCrystals: null
		
		, initialize: function _ArcadeGame(graphics, host) {
			this.BaseScene_initialize();
			this.gfx = graphics;
			this.host = host;
			this.addSceneItem(this);
			this.addSceneItem(this.gfx);
			
			// Since all other classes use 'this.game', this will provide consistency:
			this.game = this;
			this._events = new Smart.Events();
	
	
			this.stats = {};
			this._setupLevelGraphics();
			this._setupPlayer();
			this._setupEnemyFactory();
			this._setupLevelFactory();
			this._setupCrystals();
			this._setupPowerCrystals();
			this._setupProjectiles();
			this._setupHUD();
			this._setupActivePowerups();

		}
		, _setupLevelGraphics: function() {
			this.levelGraphics = this.game.gfx.createLevelGraphics();
		}
		, _setupPlayer: function() {
			this.player = new XQuestGame.Player(this.game);
			this.game.addSceneItem(this.player);
		}
		, _setupEnemyFactory: function() {
			this.enemyFactory = new XQuestGame.EnemyFactory(this.game);
			this.addSceneItem(this.enemyFactory);
		}
		, _setupLevelFactory: function() {
			this.levelFactory = new XQuestGame.LevelFactory(this.game);
			this.addSceneItem(this.levelFactory);
		}
		, _setupCrystals: function() {
			this.crystalFactory = new XQuestGame.CrystalFactory(this.game);
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
		, _setupActivePowerups: function() {
			this.activePowerups = new XQuestGame.ActivePowerups(this.game);
		}
		
		, debug: function() {
			var debug = new XQuestGame.GameDebugger(this.game);
			this.debug = function() { return debug; };
			return this.debug();
		}

		, startArcadeGame: function() {
			this.currentLevel = 1;
			this.stats.lives = Balance.player.lives;
			this.stats.bombs = Balance.bombs.startCount;
	
			this._events.fireEvent(GameEvents.onNewGame);
			
			this._arrangeNewLevel();
			this._startLevel();
		}
		, _arrangeNewLevel: function() {
			this.game.levelGraphics.closeGate();
			this.game.levelGraphics.setGateWidth(Balance.level.gateWidth);
	
			var levelConfig = {};
			this._events.fireEvent(GameEvents.onConfigureLevel, [ levelConfig ]);
			this._events.fireEvent(GameEvents.onNewLevel, [ levelConfig ]);
		}
		, _startLevel: function() {
			var middleOfGame = this.game.gfx.getGamePoint('middle');
			this.game.player.movePlayerTo(middleOfGame.x, middleOfGame.y);
			this.game.player.cancelVelocity();
			this.game.player.showPlayer(true);
	
			this.followPlayer = true;
			this.game.gfx.followPlayer(this.game.player.location);
			this.host.gfx.followPlayer(this.game.player.location);
		}
	
		, onAct: function(tickEvent) {
			if (this.followPlayer) {
				this.game.gfx.followPlayer(this.game.player.location);
				this.host.gfx.followPlayer(this.game.player.location);				
			}
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
			
			this.game.enemyFactory.clearAllEnemies();
			this.game.powerCrystals.clearAllPowerCrystals();
			this.game.projectiles.clearBullets();
	
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
				
			this.game.gfx.addAnimation(new Smart.Animation()
				.queue(function() {
					this.game.gfx.addText("Game Over").flyIn(2).delay(2).flyOut(2);
				}.bind(this)).delay(7)
				.queue(function() {
					this._events.fireEvent(GameEvents.onGameOver);						
				}.bind(this))
				/*
				.queue(function() {
					this.game.gfx.addText("Starting a new game in 5 seconds...").flyIn(2).delay(2).flyOut(2);
				}.bind(this)).delay(5)
				.queue(function() {
					this.startArcadeGame();
				}.bind(this))
				*/
			);
	
		}
	
		, levelUp: function() {
			this.game.player.showPlayer(false);
						
			// Let's kill all enemies:
			this.game.enemyFactory.killAllEnemies();
			this.game.powerCrystals.clearAllPowerCrystals();
			this.game.projectiles.clearBullets();
	
			this.currentLevel++;
	
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
				.tween(Smart.Keyframes.fromPoints([ visibleMiddle, middleOfGame ]), function(p) {
					this.game.gfx.followPlayer(p);
					this.host.gfx.followPlayer(p);
				}.bind(this));
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
			if (paused === undefined) paused = !this.scenePaused;
			else if (this.scenePaused === paused) return;
			
			this.scenePaused = paused;
			
			this.game.player.cancelVelocity();
			
			this._events.fireEvent(GameEvents.onGamePaused, [ this.scenePaused ]);
			
			this._togglePauseMenu(this.scenePaused);
		}
		, _togglePauseMenu: function(paused) {
			if (paused) {
				var pauseMenu = this.host.createMenuScene();
				pauseMenu.showPauseMenu();
				pauseMenu.onResumeGame(function() {
					this.pauseGame(false);
				}.bind(this));
				
				this.setChildScene(pauseMenu);
				this.pauseMenu = pauseMenu;
			} else {
				this.pauseMenu && this.pauseMenu.dispose();
				this.setChildScene(null);
			}
			
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
