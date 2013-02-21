Object.append(Object, {
	/**
	 * Filters the object, deleting any keys where the callback returns true.
	 *
	 * @param {Object} obj
	 * @param {Function} shouldEliminateFn
	 * @returns {Number} The number of eliminated items
	 */
	eliminate: function(obj, shouldEliminateFn) {
		var keysToEliminate = null;

		Object.each(obj, function(value, key) {
			var shouldEliminate = shouldEliminateFn(value, key);
			if (shouldEliminate) {
				if (keysToEliminate === null){
					keysToEliminate = [ key ];
				} else {
					keysToEliminate.push(key);
				}
			}
		});

		if (keysToEliminate !== null) {
			var i = keysToEliminate.length;
			while(i--) {
				var key = keysToEliminate[i];
				delete obj[key];
			}
		}

		return keysToEliminate;
	}
});
