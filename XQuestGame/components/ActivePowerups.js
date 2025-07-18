import { Class } from "@/common/src/Smart/Smart.Class.js";

export class ActivePowerups {
  constructor(game) {
    this.game = game;
    this.game.addSceneItem(this);
    this.activeTimes = {};
  }
  activate(powerupName, omitText) {
    this[powerupName] = true;
    this.activeTimes[powerupName] = "newPowerup";

    if (!omitText) {
      const powerupDisplayName = `${powerupName}!`;
      const textGfx = this.game.gfx.addText(powerupDisplayName, "powerupActive");
      textGfx.start("left").flyIn(1.5, "middle").flyOut(2, "right");
    }
  }

  _deactivate(powerupName) {
    const powerupDisplayName = `${powerupName} inactive`;
    const textGfx = this.game.gfx.addText(powerupDisplayName, "powerupDeactive");
    return textGfx.start("left").flyIn(1.5, "middle").flyOut(2, "right");
  }
  onAct(tickEvent) {
    this._updateActivePowerups(tickEvent);
  }
  _updateActivePowerups(tickEvent) {
    const B = Balance.powerups;
    const updatedValues = {};
    const deactivating = "deactivating";

    // Update new and old powerups: (never make changes to an object while iterating)
    _.forOwn(this.activeTimes, (powerupValue, powerupName) => {
      if (powerupValue === "newPowerup") {
        // New
        const powerupExpires = tickEvent.runTime + B[powerupName].duration * 1000;
        updatedValues[powerupName] = powerupExpires;
      } else if (powerupValue === deactivating) {
        // Old
      } else if (powerupValue <= tickEvent.runTime) {
        // Expired
        updatedValues[powerupName] = deactivating;
      }
    });
    _.forOwn(
      updatedValues,
      function (updatedValue, powerupName) {
        if (updatedValue === deactivating) {
          this._deactivate(powerupName).queue(() => {
            this[powerupName] = false;
            delete this.activeTimes[powerupName];
          });
        }
        this.activeTimes[powerupName] = updatedValue;
      },
      this,
    );
  }
}
