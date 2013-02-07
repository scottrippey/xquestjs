var Balance = {
	setGameMode: function(mode) {
		/* Key:
		 * px = pixels
		 * pps = pixels per second
		 */
		Object.merge(this, {
			player: {
				diameter: 8 //px
				,looseFriction: 0.5
			}
			, bullets: {
				diameter: 3 //px
				,speed: 2 // * player speed
			}
			, enemies: {
				respawnRate: dependsOnMode({ // enemies per second
					'default': { min: (1/10), max: (1/20) }
					,'test':   { min: (1/1),  max: (1/1)  }
				})
				,splat: {
					diameter: 8 //px
					,speed: dependsOnMode({ 'default': 10, 'test': 30 }) //pps
				}
			}
		});

		this._valuesChanged();

		function dependsOnMode(modeValues) {
			if (mode in modeValues)
				return modeValues[mode];
			return modeValues['default'];
		}
	}
	,
	/**
	 * Adds a callback
	 * @param {Function} balanceValuesCallback()
	 *                   A callback function that will be called when the balance values change.
	 */
	onChange: function(balanceValuesCallback) {
		if (!this.callbacks){
			this.callbacks = [];
		}
		this.callbacks.push(balanceValuesCallback);
	}
	,
	/**
	 * Removes the callback
	 */
	removeChange: function(balanceValuesCallback) {
		if (this.callbacks) {
			this.callbacks.erase(balanceValuesCallback);
		}
	}
	,
	/**
	 * Fires the callbacks
	 * @private
	 */
	_valuesChanged: function() {
		if (this.callbacks) {
			this.callbacks.each(function(balanceValuesCallback) {
				balanceValuesCallback();
			}, this);
		}
	}
};