var Sort = {
	/**
	 * Sorts an array, using a custom comparer.
	 * Works especially well for nearly-sorted arrays.
	 *
	 * @param {Array} array - The array that will be sorted
	 * @param {Function} compare(a, b) - A custom comparison function
	 */
	smoothSort: function(array, compare) {
		if (!this._smoothsort) {
			this._smoothsort = new smoothsort();
		}
		// Set the compare function:
		this._smoothsort.compare(compare);
		this._smoothsort(array);
	}
	,
	/**
	 * Sorts an array, comparing based on a property.
	 * Works especially well for nearly-sorted arrays.
	 *
	 * @param {Array} array
	 * @param {String} property
	 */
	smoothSortByProperty: function(array, property) {
		var compare = function(a, b) {
			a = a[property]; b = b[property];
			return (a < b) ? -1 : (a > b) ? 1 : 0;
		};
		Sort.smoothSort(array, compare);
	}

};