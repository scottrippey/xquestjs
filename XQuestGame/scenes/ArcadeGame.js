import { Class } from "@/common/src/Smart/Smart.Class.js";
import { Events } from "@/common/src/Smart/Smart.Events.js";
import { Animation } from "@/common/src/Smart/Animation/Smart.Animation.js";
import { Keyframes } from "@/common/src/Smart/Animation/Smart.Keyframes.js";
import { BaseScene } from "./BaseScene.js";
import { Player } from "../characters/Player.js";
import { EnemyFactory } from "../components/EnemyFactory.js";
import { LevelFactory } from "../components/LevelFactory.js";
import { CrystalFactory } from "../components/CrystalFactory.js";
import { PowerupFactory } from "../components/PowerupFactory.js";
import { Projectiles } from "../components/Projectiles.js";
import { Hud } from "../components/Hud.js";
import { ActivePowerups } from "../components/ActivePowerups.js";
import { GameDebugger } from "../components/GameDebugger.js";

const GameEvents = {
  onNewGame: "onNewGame",
  onNewLevel: "onNewLevel",
  onConfigureLevel: "onConfigureLevel",
  onPlayerKilled: "onPlayerKilled",
  onGameOver: "onGameOver",
  onNextLevel: "onNextLevel",
  onAllCrystalsGathered: "onAllCrystalsGathered",
  onGamePaused: "onGamePaused",
};

export class ArcadeGame extends BaseScene {
  player = null;
  levelGraphics = null;
  activePowerups = null;
  scenePaused = false;
  stats = null;
  powerCrystals = null;

  constructor(graphics, host) {
    super();
    this.gfx = graphics;
    this.host = host;
    this.addSceneItem(this);
    this.addSceneItem(this.gfx);

    // Since all other classes use 'this.game', this will provide consistency:
    this.game = this;
    this._events = new Events();

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
  _setupLevelGraphics() {
    this.levelGraphics = this.game.gfx.createLevelGraphics();
  }
  _setupPlayer() {
    this.player = new Player(this.game);
    this.game.addSceneItem(this.player);
  }
  _setupEnemyFactory() {
    this.enemyFactory = new EnemyFactory(this.game);
    this.addSceneItem(this.enemyFactory);
  }
  _setupLevelFactory() {
    this.levelFactory = new LevelFactory(this.game);
    this.addSceneItem(this.levelFactory);
  }
  _setupCrystals() {
    this.crystalFactory = new CrystalFactory(this.game);
  }
  _setupPowerCrystals() {
    this.powerCrystals = new PowerupFactory(this.game);
  }
  _setupProjectiles() {
    this.projectiles = new Projectiles(this.game);
  }
  _setupHUD() {
    this.hud = new Hud(this.game);
    this.addSceneItem(this.hud);
  }
  _setupActivePowerups() {
    this.activePowerups = new ActivePowerups(this.game);
  }

  debug() {
    const debug = new GameDebugger(this.game);
    this.debug = () => debug;
    return this.debug();
  }

  startArcadeGame() {
    this.currentLevel = 1;
    this.stats.lives = Balance.player.lives;
    this.stats.bombs = Balance.bombs.startCount;

    this._events.fireEvent(GameEvents.onNewGame);

    this._arrangeNewLevel();
    this._startLevel();
  }
  _arrangeNewLevel() {
    this.game.levelGraphics.closeGate();
    this.game.levelGraphics.setGateWidth(Balance.level.gateWidth);

    const levelConfig = {};
    this.game.levelConfig = levelConfig;
    this._events.fireEvent(GameEvents.onConfigureLevel, [levelConfig]);
    this._events.fireEvent(GameEvents.onNewLevel);
  }
  _startLevel() {
    const middleOfGame = this.game.gfx.getGamePoint("middle");
    this.game.player.movePlayerTo(middleOfGame.x, middleOfGame.y);
    this.game.player.cancelVelocity();
    this.game.player.showPlayer(true);

    this.followPlayer = true;
    this.game.gfx.followPlayer(this.game.player.location);
    this.host.gfx.followPlayer(this.game.player.location);
  }

  onAct(tickEvent) {
    if (this.followPlayer) {
      this.game.gfx.followPlayer(this.game.player.location);
      this.host.gfx.followPlayer(this.game.player.location);
    }
  }

  getDefaultInputState() {
    const state = {
      primaryWeapon: false,
      secondaryWeapon: false,
      engaged: false,
      accelerationX: 0,
      accelerationY: 0,
    };
    return state;
  }

  killPlayer() {
    this.game.player.killPlayer();
    this._events.fireEvent(GameEvents.onPlayerKilled);

    this.game.enemyFactory.clearAllEnemies();
    this.game.powerCrystals.clearAllPowerCrystals();
    this.game.projectiles.clearBullets();

    if (this.game.levelConfig.skipLevelOnPlayerDeath) {
      this.levelUp();
    } else if (this.game.stats.lives === 0) {
      this._gameOver();
    } else {
      this._loseALife();
    }
  }
  _loseALife() {
    this.game.stats.lives--;
    this._animateBackToCenter().queue(() => {
      this._startLevel();
    });
  }
  _gameOver() {
    // bew wew wew wew wew
    this._animateBackToCenter();

    this.game.gfx.addAnimation(
      new Animation()
        .queue(() => {
          this.game.gfx.addText("Game Over").flyIn(2).delay(2).flyOut(2);
        })
        .delay(7)
        .queue(() => {
          this._events.fireEvent(GameEvents.onGameOver);
        }),
      /*
				.queue(() => {
					this.game.gfx.addText("Starting a new game in 5 seconds...").flyIn(2).delay(2).flyOut(2);
				}).delay(5)
				.queue(() => {
					this.startArcadeGame();
				})
				*/
    );
  }

  levelUp() {
    this.game.player.showPlayer(false);

    // Let's kill all enemies:
    this.game.enemyFactory.killAllEnemies();
    this.game.powerCrystals.clearAllPowerCrystals();
    this.game.projectiles.clearBullets();

    this.currentLevel++;

    this._arrangeNewLevel();
    this._animateBackToCenter().queue(() => {
      this._startLevel();
    });

    this._events.fireEvent(GameEvents.onNextLevel);
  }
  _animateBackToCenter() {
    const visibleMiddle = this.game.gfx.getGamePoint("visibleMiddle");
    const middleOfGame = this.game.gfx.getGamePoint("middle");

    this.followPlayer = false;
    const animation = new Animation()
      .duration(2)
      .ease()
      .tween(Keyframes.fromPoints([visibleMiddle, middleOfGame]), (p) => {
        this.game.gfx.followPlayer(p);
        this.host.gfx.followPlayer(p);
      });
    this.game.gfx.addAnimation(animation);
    return animation;
  }

  crystalsGathered(remainingCrystals, gatheredCrystals) {
    if (remainingCrystals === 0) {
      this.game.levelGraphics.openGate();
      this._events.fireEvent(GameEvents.onAllCrystalsGathered);
    }
  }

  pauseGame(paused) {
    if (paused === undefined) paused = !this.scenePaused;
    else if (this.scenePaused === paused) return;

    this.scenePaused = paused;

    this.game.player.cancelVelocity();

    this._events.fireEvent(GameEvents.onGamePaused, [this.scenePaused]);

    this._togglePauseMenu(this.scenePaused);
  }
  _togglePauseMenu(paused) {
    if (paused) {
      const pauseMenu = this.host.createMenuScene();
      pauseMenu.showPauseMenu();
      pauseMenu.onResumeGame(() => {
        this.pauseGame(false);
      });

      this.setChildScene(pauseMenu);
      this.pauseMenu = pauseMenu;
    } else {
      this.pauseMenu && this.pauseMenu.dispose();
      this.setChildScene(null);
    }
  }

  toggleFPS() {
    if (this.fpsText) {
      this.fpsText.dispose();
      this.fpsText = null;
    } else {
      const textStyle = {
        color: "red",
        fontSize: "40px",
        textAlign: "left",
        textBaseline: "top",
      };
      this.fpsText = this.game.gfx.addText("FPS", textStyle);
      this.fpsText.moveTo(0, 0);
      this.fpsText.onTick = function (tickEvent) {
        const actualFPS = createjs.Ticker.getMeasuredFPS();
        const potentialFPS = 1000 / createjs.Ticker.getMeasuredTickTime();

        this.text = `FPS: ${potentialFPS.toFixed(2)} [${actualFPS.toFixed(2)}]`;
      };
    }
  }
  toggleDebugStats() {
    if (this.debugStatsText) {
      this.debugStatsText.dispose();
      this.debugStatsText = null;
    } else {
      const textStyle = {
        color: "red",
        fontSize: "40px",
        textAlign: "right",
        textBaseline: "top",
      };
      this.debugStatsText = this.game.gfx.addText("FPS", textStyle);

      const bounds = Balance.level.bounds;
      this.debugStatsText.moveTo(bounds.visibleWidth, 0);

      const gameItems = this.game.debugStats.gameItems;
      const allGraphics = this.game.gfx.debugStats.allGraphics;
      this.debugStatsText.onTick = function (tickEvent) {
        this.text = `Game Items: ${gameItems.length}\nGraphics: ${allGraphics.length}`;
      };
    }
  }
}

// Add event handler functions to ArcadeGame, so that we don't use addEvent / fireEvent directly
_.forOwn(GameEvents, (eventName, onEventName) => {
  ArcadeGame.prototype[onEventName] = function (eventHandler) {
    this._events.addEvent(eventName, eventHandler);
  };
});
