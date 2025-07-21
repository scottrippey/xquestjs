import { LocustGraphics } from "./characters/enemies/LocustGraphics.js";
import { MantisGraphics } from "./characters/enemies/MantisGraphics.js";
import { SlugGraphics } from "./characters/enemies/SlugGraphics.js";
import { PlayerGraphics } from "./characters/PlayerGraphics.js";
import { BulletsGraphics } from "./effects/BulletsGraphics.js";
import { ExplosionGraphic } from "./effects/ExplosionGraphics.js";
import { TextGraphic } from "./effects/TextGraphics.js";
import { BackgroundGraphics } from "./game/BackgroundGraphics.js";
import { BombCrystalGraphic } from "./game/BombCrystalGraphic.js";
import { BombGraphic } from "./game/BombGraphic.js";
import { CrystalGraphic } from "./game/CrystalGraphic.js";
import { LevelGraphics } from "./game/LevelGraphics.js";
import { PowerCrystalGraphic } from "./game/PowerCrystalGraphic.js";
import { HudOverlay } from "./hud/HudOverlay.js";
import { HudPauseButton } from "./hud/HudPauseButton.js";
import { MenuButton } from "./menus/MenuButton.js";
import { PauseOverlay } from "./menus/PauseOverlay.js";
import { XQuestLogoGraphic } from "./menus/XQuestLogoGraphic.js";
import { Animations } from "@/Tools/Animation/Smart.Animations.js";
import { Point } from "@/Tools/Smart.Point.js";
import { Balance } from "@/XQuestGame/options/Balance.js";

export class EaselJSGraphics {
  constructor(canvas) {
    this.canvas = canvas;

    this.debugStats = {
      allGraphics: [],
    };

    this._setupLayers();
    this._setupAnimations();
  }

  _setupLayers() {
    this.layers = {
      background: new createjs.Stage(this.canvas),
      objects: new createjs.Stage(this.canvas),
      characters: new createjs.Stage(this.canvas),
      hud: new createjs.Stage(this.canvas),
    };

    const allGraphics = this.debugStats.allGraphics;

    function trackChildren(stage) {
      const addChild = stage.addChild;
      const removeChild = stage.removeChild;
      stage.addChild = function (child) {
        addChild.apply(this, arguments);
        allGraphics.push(child);
      };
      stage.removeChild = function (child) {
        removeChild.apply(this, arguments);
        _.eliminate(allGraphics, child);
      };
    }

    _.forOwn(this.layers, (stage) => {
      trackChildren(stage);
      stage.autoClear = false;
    });
    this.layers.hud.enableMouseOver();
  }

  showBackgroundStars(visible) {
    if (visible) {
      if (!this.backgroundStars) {
        this.backgroundStars = new BackgroundGraphics();
      }
      this.layers.background.addChild(this.backgroundStars);
    } else {
      if (this.backgroundStars) {
        this.layers.background.removeChild(this.backgroundStars);
      }
    }
  }

  _setupAnimations() {
    this.animations = new Animations();
  }

  /** Creates a clone */
  createNewGraphics() {
    return new EaselJSGraphics(this.canvas);
  }

  onMove(tickEvent) {
    this.animations.update(tickEvent.deltaSeconds);
  }

  onDraw(tickEvent) {
    this.layers.background.update(tickEvent);
    this.layers.objects.update(tickEvent);
    this.layers.characters.update(tickEvent);
    this.layers.hud.update(tickEvent);
  }

  followPlayer(playerLocation, bounds = Balance.level.bounds) {
    const maxOffsetX = bounds.totalWidth - bounds.visibleWidth;
    const maxOffsetY = bounds.totalHeight - bounds.visibleHeight;

    this._offset = {
      x: Math.min(Math.max(0, playerLocation.x - bounds.visibleWidth / 2), maxOffsetX),
      y: Math.min(Math.max(0, playerLocation.y - bounds.visibleHeight / 2), maxOffsetY),
    };

    this.layers.background.x = -this._offset.x;
    this.layers.objects.x = -this._offset.x;
    this.layers.characters.x = -this._offset.x;

    this.layers.background.y = -this._offset.y;
    this.layers.objects.y = -this._offset.y;
    this.layers.characters.y = -this._offset.y;
  }

  getSafeSpawn(radius) {
    const leftEnemySpawn = this.getGamePoint("left");
    const rightEnemySpawn = this.getGamePoint("right");
    const safeDistance = Balance.enemies.safeSpawnDistance;
    let randomSpot;
    let isSafe;
    do {
      randomSpot = this.getGamePoint("random", radius);
      isSafe =
        !Point.distanceTest(leftEnemySpawn, randomSpot, safeDistance) &&
        !Point.distanceTest(rightEnemySpawn, randomSpot, safeDistance);
    } while (!isSafe);
    return randomSpot;
  }

  getGamePoint(gamePoint, radius) {
    if (typeof gamePoint !== "string") return gamePoint;
    if (!radius) radius = 0;
    const bounds = Balance.level.bounds;
    switch (gamePoint) {
      case "random":
        return {
          x: bounds.x + radius + (bounds.width - radius - radius) * Math.random(),
          y: bounds.y + radius + (bounds.height - radius - radius) * Math.random(),
        };
      case "visibleMiddle":
        return {
          x: this._offset.x + bounds.visibleWidth / 2,
          y: this._offset.y + bounds.visibleHeight / 2,
        };
      case "middle":
        return {
          x: bounds.x + bounds.width / 2,
          y: bounds.y + bounds.height / 2,
        };
      case "top":
        return {
          x: bounds.x + bounds.width / 2,
          y: bounds.y + radius,
        };
      case "bottom":
        return {
          x: bounds.x + bounds.width / 2,
          y: bounds.y + bounds.height - radius,
        };
      case "left":
        return {
          x: bounds.x + radius,
          y: bounds.y + bounds.height / 2,
        };
      case "right":
        return {
          x: bounds.x + bounds.width - radius,
          y: bounds.y + bounds.height / 2,
        };
      default:
        throw new Error(`Invalid gamePoint: ${gamePoint}`);
    }
  }

  getHudPoint(hudPoint) {
    if (typeof hudPoint !== "string") return hudPoint;
    const bounds = Balance.level.bounds;
    switch (hudPoint) {
      case "middle":
        return { x: bounds.visibleWidth / 2, y: bounds.visibleHeight / 2 };
      case "top":
        return { x: bounds.visibleWidth / 2, y: 0 };
      case "bottom":
        return { x: bounds.visibleWidth / 2, y: bounds.visibleHeight };
      case "left":
        return { x: 0, y: bounds.visibleHeight / 2 };
      case "right":
        return { x: bounds.visibleWidth, y: bounds.visibleHeight / 2 };
    }
    return null;
  }

  createLevelGraphics() {
    const levelGraphics = new LevelGraphics();
    this.layers.background.addChild(levelGraphics);
    levelGraphics.onDispose(() => {
      this.layers.background.removeChild(levelGraphics);
    });
    return levelGraphics;
  }

  createPlayerGraphics() {
    const playerGraphics = new PlayerGraphics();
    this.layers.characters.addChild(playerGraphics);
    return playerGraphics;
  }

  createPlayerHUDIcon() {
    const playerGraphics = new PlayerGraphics();
    const scale = 0.7;
    playerGraphics.scaleTo(scale);
    playerGraphics.visibleRadius *= scale;
    this.layers.hud.addChild(playerGraphics);
    return playerGraphics;
  }

  createBulletsGraphics() {
    const bulletsGraphics = new BulletsGraphics();
    this.layers.objects.addChild(bulletsGraphics);
    bulletsGraphics.onDispose(() => {
      this.layers.objects.removeChild(bulletsGraphics);
    });
    return bulletsGraphics;
  }

  createEnemyGraphics(enemyName) {
    let enemyGraphics = null;
    switch (enemyName) {
      case "Slug":
        enemyGraphics = new SlugGraphics();
        break;
      case "Locust":
        enemyGraphics = new LocustGraphics();
        break;
      case "Mantis":
        enemyGraphics = new MantisGraphics();
        break;
    }

    if (enemyGraphics == null) throw new Error(`Unknown enemy: ${enemyName}`);

    this.layers.characters.addChild(enemyGraphics);
    enemyGraphics.onDispose(() => {
      this.layers.characters.removeChild(enemyGraphics);
    });

    return enemyGraphics;
  }

  createCrystalGraphic() {
    const crystal = new CrystalGraphic();
    this.layers.objects.addChild(crystal);
    crystal.onDispose(() => {
      this.layers.objects.removeChild(crystal);
    });
    return crystal;
  }

  createCrystalHUDIcon() {
    const crystal = new CrystalGraphic();
    const scale = 0.7;
    crystal.scaleTo(scale);
    crystal.visibleRadius *= scale;
    this.layers.hud.addChild(crystal);
    return crystal;
  }

  createPowerCrystalGraphic() {
    const powerCrystal = new PowerCrystalGraphic();
    this.layers.characters.addChild(powerCrystal);
    powerCrystal.onDispose(() => {
      this.layers.characters.removeChild(powerCrystal);
    });
    return powerCrystal;
  }

  createBombCrystalGraphic() {
    const bombCrystal = new BombCrystalGraphic();
    this.layers.objects.addChild(bombCrystal);
    bombCrystal.onDispose(() => {
      this.layers.objects.removeChild(bombCrystal);
    });
    return bombCrystal;
  }

  createBombCrystalHUDIcon() {
    const bombCrystal = new BombCrystalGraphic();
    const scale = 0.7;
    bombCrystal.scaleTo(scale);
    bombCrystal.visibleRadius *= scale;
    this.layers.hud.addChild(bombCrystal);
    bombCrystal.onDispose(() => {
      this.layers.hud.removeChild(bombCrystal);
    });
    return bombCrystal;
  }

  createBombGraphic() {
    const bomb = new BombGraphic();
    this.layers.objects.addChild(bomb);
    bomb.onDispose(() => {
      this.layers.objects.removeChild(bomb);
    });
    return bomb;
  }

  createExplosion(position, velocity, explosionOptions) {
    const explosion = new ExplosionGraphic(position, velocity, explosionOptions);
    this.layers.objects.addChild(explosion);
    explosion.onDispose(() => {
      this.layers.objects.removeChild(explosion);
    });
    return explosion;
  }

  addAnimation(animation) {
    return this.animations.addAnimation(animation);
  }

  addText(text, textStyle) {
    const textGfx = new TextGraphic();
    textGfx.setGfx(this);
    textGfx.setText(text, textStyle);

    this.layers.hud.addChild(textGfx);
    textGfx.onDispose(() => {
      this.layers.hud.removeChild(textGfx);
    });

    return textGfx;
  }

  enableTouchClicks() {
    createjs.Touch.enable(this.layers.hud);
  }

  createHUDOverlay() {
    const hudOverlay = new HudOverlay();
    this.layers.hud.addChild(hudOverlay);
    hudOverlay.onDispose(() => {
      this.layers.hud.removeChild(hudOverlay);
    });
    return hudOverlay;
  }

  createPauseButtonHUD() {
    const pauseButton = new HudPauseButton(this);
    this.layers.hud.addChild(pauseButton);
    pauseButton.onDispose(() => {
      this.layers.hud.removeChild(pauseButton);
    });
    return pauseButton;
  }

  createPauseOverlay() {
    const pauseOverlay = new PauseOverlay(this);
    this.layers.background.addChild(pauseOverlay);
    pauseOverlay.onDispose(() => {
      this.layers.background.removeChild(pauseOverlay);
    });
    return pauseOverlay;
  }

  createMenuButton(text) {
    const buttonGfx = new MenuButton(this);
    buttonGfx.setText(text);
    buttonGfx.addButtonEvents = function (events) {
      if (events.invoke) this.addEventListener("click", events.invoke);
      if (events.hoverEnter) this.addEventListener("mouseover", events.hoverEnter);
      if (events.hoverLeave) this.addEventListener("mouseout", events.hoverLeave);
    };
    this.layers.hud.addChild(buttonGfx);
    buttonGfx.onDispose(() => {
      this.layers.hud.removeChild(buttonGfx);
    });
    return buttonGfx;
  }

  createXQuestLogoGraphic() {
    const introGraphics = new XQuestLogoGraphic(this);
    this.layers.objects.addChild(introGraphics);
    introGraphics.onDispose(() => {
      this.layers.hud.removeChild(introGraphics);
    });

    return introGraphics;
  }
}

window.EaselJSGraphics = EaselJSGraphics;
