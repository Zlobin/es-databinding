import DOM from './dom/dom';
import exportFn from './utils/export';
import ObjectPath from './utils/object_path';

import {
  isObject,
  isEmpty,
  isFunction,
  areEqual,
  clone,
  each,
  defineProperty
} from './utils/lang';

export default class DataBinder extends ObjectPath {
  constructor(state = {}, binding = {}) {
    const clonedState = clone(state);
    const clonedBinding = clone(binding);

    super(clonedState);

    this.state = clonedState;
    this.binding = clonedBinding;

    this.init();

    return this.state;
  }

  /*
   *
   */
  init() {
    this
      .setDOM(DOM)
      .setExportMethod(exportFn)
      .addStateListeners()
      .applyStateToDOM()
      .addDOMListeners();
  }

  /*
   * Prepare exportable data.
   */
  export() {
    return this.makeExport(this.state);
  }

  /*
   * Composition of the DOM implementation.
   */
  setDOM(Dom) {
    this.dom = () => new Dom();

    return this;
  }

  /*
   * Export fn composition.
   */
  setExportMethod(fn) {
    this.makeExport = fn;

    return this;
  }

  /*
   * Update DOM element by new value.
   */
  updateDom(path, value) {
    this.dom()
      .find(this.element(path))
      .set(value, this.transform(path, value));
  }

  /*
   * Apply state for bound elements.
   */
  applyStateToDOM() {
    each(this.binding, path =>
      this.updateDom(path, this.get(path))
    );

    return this;
  }

  /*
   * Add listeners for DOM elements.
   */
  addDOMListeners() {
    each(this.binding, key =>
      this.dom()
        .find(this.element(key))
        .watch(event => {
          const el = this.dom().getEl(event);
          const value = this.dom().wrap(el).get();

          if (!areEqual(value, this.get(key))) {
            this.set(key, value);
            this.callback(key, el, value);
          }
        })
    );

    return this;
  }

  /*
   * Add listeners for changing state (model data).
   */
  addStateListeners() {
    const updateDom = (path, value) =>
      this.updateDom(path, value);
    const updateDependencies = updatedPath => {
      each(this.binding, path =>
        this
          .dependencies(path)
          .some(value => {
            if (areEqual(updatedPath, value)) {
              this.updateDom(path, value);
              return true;
            }

            return false;
          })
      );
    };

    each(this.binding, path => {
      let fullPath = '';

      this.forPath(path, (obj, key) => {
        const delimiter = !isEmpty(fullPath) ? this.delimiter : '';
        fullPath += `${delimiter}${key}`;

        let value = obj[key];
        const setter = newValue => {
          if (!areEqual(value, newValue)) {
            value = newValue;
            this[key] = newValue;
            updateDom.bind(this)(fullPath, newValue);
            updateDependencies.bind(this)(fullPath);
          }
        };
        const getter = () => value;

        if (!isObject(value)) {
          defineProperty(obj, key, setter, getter);
        }

        return obj[key];
      });
    });

    return this;
  }

  /*
   * Get DOM element.
   */
  element(key) {
    const element = this.binding[key];

    return isObject(element) ?
      element.el :
      element;
  }

  /*
   * Apply transform callback to value.
   */
  transform(key, value) {
    const element = this.binding[key];

    return isObject(element) ?
      element.transform(value, this.get.bind(this)) :
      value;
  }

  /*
   * Run callback attached to the element.
   */
  callback(key, el, value) {
    const element = this.binding[key];

    return isObject(element) && isFunction(element.callback) ?
      element.callback(el, value) :
      () => {};
  }

  /*
   * Get dependencies.
   */
  dependencies(key) {
    const element = this.binding[key];

    return isObject(element) ?
      element.dependent || [] :
      [];
  }
}
