export class Disposable {
  _onDispose = undefined;

  /**
   * Adds a "cleanup" handler that will be called when `dispose` is called.
   * @param {Function} callback
   */
  onDispose(callback) {
    if (this._onDispose === null) throw new Error("Object is already disposed!");
    if (this._onDispose === undefined) this._onDispose = [callback];
    else this._onDispose.push(callback);
  }

  /**
   * Calls all "cleanup" handlers that were added via `onDispose`
   */
  dispose() {
    if (this._onDispose === null) throw new Error("Object is already disposed!");
    if (this._onDispose) {
      this._onDispose.forEach(function (callback) {
        callback.call(this);
      }, this);
      this._onDispose = null;
    }
  }
}
