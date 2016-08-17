import Observer from './';

export default class ObjectObserver extends Observer {
  constructor(state = {}) {
    this.state = state;
  }

  update(obj, ...args) {
    // ...
  }
}
