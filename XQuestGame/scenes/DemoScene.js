import { HostScene } from "./HostScene.js";
import { Locust } from "@/XQuestGame/characters/enemies/Locust.js";
import { Balance } from "@/XQuestGame/options/Balance.js";

export class DemoScene extends HostScene {
  constructor(gfx, settings, component) {
    super(gfx, settings);
    this.component = component;
    this.game = this;
    this.game.layerConfig = {
      bounds: {
        x: 0,
        y: 0,
        width: this.gfx.canvas.width,
        height: this.gfx.canvas.height,
      },
    };
    this.levelConfig = {
      bounds: {
        x: 10,
        y: 10,
        width: this.gfx.canvas.width / 10,
        height: this.gfx.canvas.height / 10,
      },
    };
  }

  /** @override */
  start() {
    const comp = this._createComponent(this.component);
    this._moveToMiddle(comp);
    // this.gfx.followPlayer(comp);
  }
  _moveToMiddle(obj) {
    const canvas = this.gfx.canvas;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const x = centerX - (obj.visibleWidth ?? 0) / 2;
    const y = centerY - (obj.visibleHeight ?? 0) / 2;
    (obj.location || obj).moveTo(x, y);
  }
  _createComponent(component) {
    if (component === "Logo") {
      const logo = this.gfx.createXQuestLogoGraphic();

      return logo;
    } else if (component === "Locust") {
      const locust = new Locust(this.game);
      locust.spawn({ x: 0, y: 0, side: 1 });
      this.addSceneItem(locust);
      return locust;
    } else {
      throw new Error(`Unknown component: "${component}"`);
    }
  }
}
