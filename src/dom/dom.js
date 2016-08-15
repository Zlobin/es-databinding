/* global document */

import {
  or,
  isString,
  isNumber,
  setGet
} from '../utils/lang';
import elFacade from './el_facade';

const doc = document;

export default class DOM {
  constructor() {
    this.el = [];
    this.setFacade();
  }

  /*
   * Wrap el by some helper methods.
   */
  setFacade(obj = elFacade) {
    this.facade = obj;
  }

  /*
   * Loop for each element.
   */
  each(callback) {
    this.el.forEach(el => callback(el));
  }

  /*
   * Find elements.
   */
  find(element) {
    this.el = doc.querySelectorAll(element);

    return this;
  }

  /*
   * Add event listener for an DOM element.
   */
  on(el, type, callback) {
    el.addEventListener(type, callback);

    return this;
  }

  /*
   * Set or get "value" attribute.
   */
  value(el, value) {
    return setGet(el, this.facade(el).valueAttribute(), value);
  }

  /*
   * Add element to the list.
   */
  wrap(el) {
    this.el = [el];

    return this;
  }

  /*
   * Set or get "innerText" attribute.
   */
  text(el, value) {
    return setGet(el, 'innerText', value);
  }

  /*
   * Return element from event.
   */
  getEl(event) {
    return this.facade(event).el();
  }

  /*
   * Get data (value, text) from DOM element(s).
   */
  get() {
    const response = [];

    this.each(el => response
      .push(this[this.facade(el).getterMethod()](el)));

    return response.length > 1 ?
      response :
      response[0];
  }

  /*
   * Set data to the DOM element(s).
   */
  set(value, transformedValue) {
    // @todo move "transformValue" outside
    this.each(el => {
      const dataAttribute = this.facade(el).dataAttribute();
      const attachedValue = this.facade(el).isChangeable() ?
        value :
        transformedValue;

      // 1. html, string
      // 2. array @todo
      // 3. object @todo

      if (or([isString, isNumber])(transformedValue)) {
        this[dataAttribute](el, attachedValue);
      }
    });

    return this;
  }

  /*
   * To observe for changing element's "data" attribute.
   */
  watch(callback) {
    this.each(el =>
      this.facade(el).isChangeable() &&
      this.on(el, this.facade(el).getChangeEvent(), callback)
    );

    return this;
  }
}
