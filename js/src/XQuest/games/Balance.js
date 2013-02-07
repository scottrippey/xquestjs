var Balance = {
	setGameMode: function(mode) {
		/* Key:
		 * px = pixels
		 * pps = pixels per second
		 */
		Object.merge(this, {
			player: {
				diameter: 12 //px
				,looseFriction: 0.5
			}
			,bullets: {
				diameter: 3 //px
				,speed: 2 // * player speed
			}
			,enemies: {
				safeDiameter: 15 //px - should be the largest enemy size
				,spawnRate: dependsOnMode({ // seconds per enemies
					'default': { min: 10, max: 20 }
					,'test':   { min: 3,  max: 5  }
				})
				,splat: {
					diameter: 8 //px
					,speed: dependsOnMode({ 'default': 10, 'test': 30 }) //pps
				}
			}
			,level: {
				bounds: {
					x: 10, y: 10, width: 720-10-10, height: 405-10-10
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