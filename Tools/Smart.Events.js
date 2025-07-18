export class Events {
  addEvent(eventName, callback) {
    if (!this.$events) this.$events = {};
    if (!this.$events[eventName]) this.$events[eventName] = [callback];
    else this.$events[eventName].push(callback);
  }
  fireEvent(eventName, eventArgs) {
    const callbacks = this.$events && this.$events[eventName];
    if (!callbacks) return;
    if (!eventArgs) eventArgs = [];

    for (let i = 0, l = callbacks.length; i < l; i++) {
      callbacks[i].apply(null, eventArgs);
    }
  }
}
