_.mixin({
  eliminate(array, item) {
    var index = array.indexOf(item);
    if (index !== -1) {
      array.splice(index, 1);
    }
  },
});

if (!_.forEachRight) {
  _.mixin({
    forEachRight(collection, callback, thisArg) {
      var length = collection ? collection.length : 0;
      while (length--) {
        if (callback(collection[length], length, collection) === false) {
          break;
        }
      }
      return collection;
    },
  });
}
