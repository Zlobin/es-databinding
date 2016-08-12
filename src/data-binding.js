import DOM from './dom';
import {
  isObject,
  isFunction,
  isArray,
  isBlank,
  areEqual,
  clone,
  each
} from './utils';

export default class DataBinder {
  constructor(state = {}, binding = {}, settings = {}) {
    this.state = clone(state);
    this.binding = clone(binding);
    this.isDebug = settings.isDebug || false;
    this.pathDelimiter = settings.pathDelimiter || '.';

    this._addStateListeners();
    this._applyStateToDOM();
    this._addDOMListeners();

    return this.state;
  }

  /*
   * Prepare exportable data.
   */
  export() {
    return JSON.stringify(this.state);
  }

  /*
   * Update DOM element by new value.
   */
  _updateElement(path, value) {
    new DOM()
      .find(this._element(path))
      .set(value, this._transform(path, value));
  }

  /*
   * Apply state for bound elements.
   */
  _applyStateToDOM() {
    each(this.binding, path =>
      this._updateElement(path, this._get(path))
    );
  }

  /*
   * Add listeners for DOM elements.
   */
  _addDOMListeners() {
    each(this.binding, key =>
      new DOM()
        .find(this._element(key))
        .watch(event => {
          const el = event.target;
          const value = new DOM().get(el);

          if (!areEqual(value, this._get(key))) {
            this._set(key, value);
            this._callback(key, el, value);
          }
        })
    );
  }

  /*
   * Add listeners for changing state (model data).
   */
  _addStateListeners() {
    const updateElement = (path, value) =>
      this._updateElement(path, value);
    const updateDependencies = updatedPath => {
      each(this.binding, path => {
        const dependencies = this._dependencies(path);

        if (isArray(dependencies)) {
          dependencies.some(value => {
            if (updatedPath === value) {
              this._updateElement(path, value);
              return true;
            }

            return false;
          });
        }
      });
    };

    each(this.binding, path => {
      let fullPath = '';

      path
        .split(this.pathDelimiter)
        .reduce((obj, key) => {
          let value = obj[key];

          fullPath += (fullPath !== '' ? '.' : '') + key;

          if (!isObject(value)) {
            Object.defineProperty(obj, key, {
              enumerable: true,
              configurable: true,
              set: function setPropery(newValue) {
                if (value !== newValue) {
                  value = newValue;
                  this[key] = newValue;
                  updateElement(fullPath, newValue);
                  updateDependencies(fullPath);
                }
              },
              get: () => value
            });
          }

          return obj[key];
        }, this.state);
    });
  }

  /*
   * Get value from state with string path.
   * Examples:
   *  'user.id'
   *  'user.location.city'
   *  'user.skills'
   *  'user.skills.0'
   */
  _get(path) {
    return path
      .split(this.pathDelimiter)
      .reduce((obj, idx) => obj[idx], this.state);
  }

  /*
   * Set value to state.
   */
  _set(path, value) {
    const parts = path.split('.');
    let obj = this.state;

    while (parts.length > 1) {
      const name = parts.shift();

      if (Object.prototype.hasOwnProperty.call(obj, name)) {
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

  /*
   * Get DOM element.
   */
  _element(key) {
    const element = this.binding[key];

    return isObject(element) ?
      element.el :
      element;
  }

  /*
   * Apply transform callback to value.
   */
  _transform(key, value) {
    const element = this.binding[key];

    return isObject(element) ?
      element.transform(value, this._get.bind(this)) :
      value;
  }

  /*
   * Run callback attached to the element.
   */
  _callback(key, el, value) {
    const element = this.binding[key];

    return isObject(element) && isFunction(element.callback) ?
      element.callback(el, value) :
      null;
  }

  /*
   * Get dependencies.
   */
  _dependencies(key) {
    const element = this.binding[key];

    return isObject(element) ?
      element.dependent :
      null;
  }
}
