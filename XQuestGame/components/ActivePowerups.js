XQuestGame.ActivePowerups = Smart.Class({
	initialize: function(game) {
		this.game = game;
		this.game.addSceneItem(this);
		this.activeTimes = {};
	},
	activate: function(powerupName, omitText) {
		this[powerupName] = true;
		this.activeTimes[powerupName] = 'newPowerup';
			
		if (!omitText) {
			var powerupDisplayName = powerupName + "!";
			var textGfx = this.game.gfx.addText(powerupDisplayName, 'powerupActive');
			textGfx.start('left').flyIn(1.5, 'middle').flyOut(2, 'right');
		}
		
	}
	,
	_deactivate: function(powerupName) {
		var powerupDisplayName = powerupName + " inactive";
		var textGfx = this.game.gfx.addText(powerupDisplayName, 'powerupDeactive');
		return textGfx.start('left').flyIn(1.5, 'middle').flyOut(2, 'right');
	}
	, onAct: function(tickEvent) {
		this._updateActivePowerups(tickEvent);
	}
	, _updateActivePowerups: function(tickEvent) {
		var B = Balance.powerups;
		var updatedValues = {};
		var deactivating = 'deactivating';
		
		// Update new and old powerups: (never make changes to an object while iterating)
		_.forOwn(this.activeTimes, function(powerupValue, powerupName) {
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
				this._deactivate(powerupName).queue(function() {
					this[powerupName] = false;
					delete this.activeTimes[powerupName];
				}.bind(this));
			}
			this.activeTimes[powerupName] = updatedValue;
		}, this);

	}



});