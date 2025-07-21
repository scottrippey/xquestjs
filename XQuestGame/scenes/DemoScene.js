import { HostScene } from "./HostScene.js";
import { BombCrystal } from "@/XQuestGame/characters/BombCrystal.js";
import { allEnemies } from "@/XQuestGame/characters/enemies/index.js";
import { Player } from "@/XQuestGame/characters/Player.js";
import { PowerCrystal } from "@/XQuestGame/characters/PowerCrystal.js";
import { Balance } from "@/XQuestGame/options/Balance.js";

export class DemoScene extends HostScene {
  constructor(gfx, settings, component) {
    super(gfx, settings);
    this.component = component;
    this.game = this;

    this.bounds = {
      ...Balance.level.bounds,
      visibleWidth: this.game.gfx.canvas.width,
      visibleHeight: this.game.gfx.canvas.height,
    };
  }

  /** @override */
  start() {
    this._createComponent(this.component);
  }

  _addToMiddle(obj) {
    this.addSceneItem(obj);

    const bounds = this.game.bounds;
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;
    const x = centerX - (obj.visibleWidth ?? 0) / 2;
    const y = centerY - (obj.visibleHeight ?? 0) / 2;
    (obj.location || obj).moveTo(x, y);
  }
  _follow(location) {
    this.addSceneItem({
      onAct: () => this.game.gfx.followPlayer(location, this.game.bounds),
    });
  }
  _createComponent(component) {
    // Check for any known enemy names:
    const Spawnable = [
      ///
      ...allEnemies,
      PowerCrystal,
      BombCrystal,
      Player,
    ].find((C) => C.name === component);
    if (Spawnable) {
      this._addLevelGraphics();
      const instance = new Spawnable(this.game);
      instance.spawn?.({ x: 0, y: 0, side: 2 });
      this._addToMiddle(instance);
      this._follow(instance.location);
      return;
    }

    if (component === "Logo") {
      const logo = this.gfx.createXQuestLogoGraphic();
      this._addToMiddle(logo);
      return;
    }
    if (component === "PowerCrystal") {
      const p = new PowerCrystal(this.game);
      p.spawn({ x: 0, y: 0, side: 2 });
      this._addToMiddle(p);
      return;
    }

    throw new Error(`Unknown component: "${component}"`);
  }

  _addLevelGraphics() {
    this.levelGraphics = this.game.gfx.createLevelGraphics();
  }
}
