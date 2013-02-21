Object.append(Array, {
	/**
	 * Filters the array, removing any item where the callback returns true.
	 *
	 * @param {Array} array
	 * @param {Function} shouldEliminateFn
	 * @returns {Number} The number of eliminated items
	 */
	eliminate: function(array, shouldEliminateFn) {
		var eliminatedCount = 0;

		for (var i = 0; i < array.length; i++) {
			var shouldEliminate = shouldEliminateFn(array[i], i);
			if (shouldEliminate) {
				array.splice(i, 1);
				i--;
				eliminatedCount++;
			}
		}

		return eliminatedCount;
	}
});
