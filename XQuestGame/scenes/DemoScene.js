import { HostScene } from "./HostScene.js";
import { Locust } from "@/XQuestGame/characters/enemies/Locust.js";
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
    if (component === "Logo") {
      const logo = this.gfx.createXQuestLogoGraphic();
      this._addToMiddle(logo);
      return logo;
    } else if (component === "Locust") {
      this._addLevelGraphics();
      const locust = new Locust(this.game);
      locust.spawn({ x: 0, y: 0, side: 2 });
      this._addToMiddle(locust);
      this._follow(locust.location);
      return locust;
    } else {
      throw new Error(`Unknown component: "${component}"`);
    }
  }

  _addLevelGraphics() {
    this.levelGraphics = this.game.gfx.createLevelGraphics();
  }
}
