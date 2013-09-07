_.mixin({
	/**
	 * Modifies the original object or array, removing any item where the callback returns true.
	 *
	 * @param {Object|Array} objOrArray
	 * @param {Function} predicate
	 * @returns {Number} The number of eliminated items
	 */
	eliminate: function(objOrArray, predicate) {
		if (typeof objOrArray.length === 'number') {
			return _.eliminateArray(objOrArray, predicate);
		} else {
			return _.eliminateObject(objOrArray, predicate);
		}
	}
	,
	eliminateArray: function(array, predicate) {
		var originalLength = array.length;

		var i = array.length;
		while (i--) {
			var shouldEliminate = predicate(array[i], i);
			if (shouldEliminate) {
				array.splice(i, 1);
			}
		}

		return originalLength - array.length;
	}
	,
	eliminateObject: function(obj, predicate) {
		var keysToEliminate = null;

		_.forOwn(obj, function(value, key) {
			var shouldEliminate = predicate(value, key);
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
			while (i--) {
				var key = keysToEliminate[i];
				delete obj[key];
			}
		}

		return keysToEliminate;
	}

});
