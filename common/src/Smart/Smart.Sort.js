Smart.Sort = {
	/**
	 * Sorts the array, using a custom comparer.
	 *
	 * Performs especially well for nearly-sorted arrays - O(n).
	 * And for unsorted arrays, performs very well - O(n lg n).
	 *
	 * @param {Array} array - The array that will be sorted.  The original array WILL be modified.
	 * @param {Function} compare(a, b) - A custom comparison function
	 * @returns {Array} Returns the original, modified array.
	 */
	smoothSort(array, compare) {
		if (!this._smoothsort) {

			this._smoothsort = new window.smoothsort();
		}
		// Set the compare function:
		this._smoothsort.compare(compare);
		this._smoothsort(array);

		return array;
	},

	/**
	 * Sorts the array, comparing based on a property.
	 *
	 * @param {Array} array
	 * @param {String} property
	 */
	smoothSortByProperty(array, property) {
		var compare = function(a, b) {
			a = a[property];
			b = b[property];
			return (a < b) ? -1 : (a > b) ? 1 : 0;
		};
		return Smart.Sort.smoothSort(array, compare);
	}

};
