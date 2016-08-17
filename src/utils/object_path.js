import {
  isBlank,
  hasProperty
} from './lang';

// replace [0], [1] to .0 .1 etc.
const pathResolver = path => path
  .replace(/\[(\d)\]/, '.$1');

export default class ObjectPath {
  constructor(obj = {}, delimiter = '.') {
    this.obj = obj;
    this.delimiter = delimiter;
  }

  split(path) {
    return pathResolver(path)
      .split(this.delimiter);
  }

  forPath(path, callback) {
    return this
      .split(path)
      .reduce(callback, this.obj);
  }

  /*
   * Get value from state with string path.
   * Examples:
   *  'user.id'
   *  'user.location.city'
   *  'user.skills'
   *  'user.skills.0'
   *  'user.skills[0]'
   */
  get(path) {
    return this
      .forPath(path, (obj, idx) => obj[idx]);
  }

  /*
   * Set value to state.
   */
  set(path, value) {
    const parts = this.split(path);
    let obj = this.obj;

    while (parts.length > 1) {
      const name = parts.shift();

      if (hasProperty(obj, name)) {
        obj = obj[name];
      } else {
        obj = obj[name] = {};
      }
    }

    if (isBlank(obj)) {
      obj = {};
    }

    obj[parts.shift()] = value;
  }
}
