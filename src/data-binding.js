import Set from 'lodash/set';
import DOM from './dom';
// import {checkAllDependencies} from './dependencies';
import {
  isObject,
  isFunction,
  areEqual,
  clone,
  each
} from './utils';

// checkAllDependencies();

export default class DataBinder {
  constructor(state = {}, binding = {}, settings = {}) {
    this.initState = clone(state);
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
    // @todo exportable data.
    return '';
  }

  /*
   * Apply state for bound elements.
   */
  _applyStateToDOM(state = null) {
    each(this.binding, key =>
      new DOM()
        .find(this._element(key))
        .set(this._transform(key, this._get(key)))
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
    const updateElement = (path, value) => {
      new DOM()
        .find(this._element(path))
        .set(this._transform(path, value));
    };
    const updateDependencies = path => {
      // @todo
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
              set: function(newValue) {
                if (value !== newValue) {
                  value = newValue;
                  this[key] = newValue;
                  updateElement(fullPath, newValue);
                  updateDependencies(fullPath);
                }
              },
              get: () => {
                return value;
              }
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
    // Lodash.set instead.
    return Set(this.state, path, value);
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
