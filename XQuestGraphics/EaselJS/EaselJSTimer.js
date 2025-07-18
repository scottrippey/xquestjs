/**
 * This is a wrapper around createjs.Ticker
 * @constructor
 */
export class EaselJSTimer {
  addTickHandler(tickHandler) {
    // Configuration:
    createjs.Ticker.useRAF = true;
    createjs.Ticker.setFPS(60);

    createjs.Ticker.addEventListener("tick", (tickEvent) => {
      // Augment the tickEvent:
      tickEvent.deltaSeconds = tickEvent.delta / 1000;

      tickHandler(tickEvent);
    });
  }

  dispose() {
    createjs.Ticker.removeAllEventListeners("tick");
  }
}
