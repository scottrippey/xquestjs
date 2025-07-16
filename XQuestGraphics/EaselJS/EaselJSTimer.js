import { Class } from "common/src/Smart/Smart.Class";

/**
 * This is a wrapper around createjs.Ticker
 * @constructor
 */
const EaselJSTimer = Class({
  addTickHandler(tickHandler) {
    // Configuration:
    createjs.Ticker.useRAF = true;
    createjs.Ticker.setFPS(60);

    createjs.Ticker.addEventListener("tick", (tickEvent) => {
      // Augment the tickEvent:
      tickEvent.deltaSeconds = tickEvent.delta / 1000;

      tickHandler(tickEvent);
    });
  },

  dispose() {
    createjs.Ticker.removeAllEventListeners("tick");
  },
});
