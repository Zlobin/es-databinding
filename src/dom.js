import {
  doc,
  isString,
  isNumber,
  isNull
} from './utils';

export default class DOM {
  constructor() {
    this.el = [];
  }

  /*
   * Loop for each element.
   */
  _each(callback) {
    this.el.forEach(el => callback(el));
  }

  /*
   * Set or get value an attribute from DOM element.
   */
  _eq(el, attribute, value = null) {
    /* eslint-disable no-param-reassign */
    return isNull(value) ?
      el[attribute] :
      (el[attribute] = value);
    /* eslint-enable no-param-reassign */
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
  _on(el, type, callback) {
    el.addEventListener(type, callback);

    return this;
  }

  /*
   * Set or get "value" attribute.
   */
  _value(el, value = null) {
    const attribute = this._isCheckOn(el) ? 'checked' : 'value';

    return this._eq(el, attribute, value);
  }

  /*
   * Set or get "innerText" attribute.
   */
  _text(el, value = null) {
    return this._eq(el, 'innerText', value);
  }

  /*
   * Determine in which attribute an element has data.
   */
  _getDataAttribute(el) {
    switch (el.nodeName) {
      case 'OPTION':
      case 'INPUT':
      case 'PROGRESS':
      case 'TEXTAREA':
        return 'value';
      default:
        return 'text';
    }
  }

  /*
   *
   */
  _isChangeable(el) {
    return this._getDataAttribute(el) === 'value';
  }

  /*
   * Determine if an element - checkbox or radio.
   */
  _isCheckOn(el) {
    return ['checkbox', 'radio'].indexOf(el.type) >= 0;
  }

  /*
   *
   */
  _isMultipleSelect(el) {
    return el.type === 'select-multiple';
  }

  /*
   * Check if an element has "value" attribute.
   */
  _hasValueData(el) {
    return [
      'color',
      'date',
      'datetime-local',
      'email',
      'month',
      'number',
      'password',
      'range',
      'search',
      'select-one',
      'time',
      'tel',
      'text',
      'textarea',
      'url',
      'week'
    ].indexOf(el.type) >= 0;
  }

  /*
   * Check if an element has "change" event.
   */
  _hasChangeEvent(el) {
    return [
      'checkbox',
      'radio',
      'select-one',
      'select-multiple',
      'password'
    ].indexOf(el.type) >= 0;
  }

  /*
   * Determine which event should be listened.
   */
  _getChangeEvent(el) {
    if (this._hasValueData(el)) {
      return 'input';
    } else if (this._hasChangeEvent(el)) {
      return 'change';
    }

    return null;
  }

  /*
   * Get data from an element.
   */
  get(el) {
    const method = this._isChangeable(el) ?
      '_value' :
      '_text';

    return this[method](el);
  }

  /*
   * Set data to the element.
   */
  set(value, transformedValue) {
    this._each(el => {
      const dataAttribute = this._getDataAttribute(el);
      const attachedValue = this._isChangeable(el) ?
        value :
        transformedValue;

      // 1. html, string
      // 2. array (@todo)
      // 3. object (@todo)

      if (isString(transformedValue) || isNumber(transformedValue)) {
        this[`_${dataAttribute}`](el, attachedValue);
      }
    });

    return this;
  }

  /*
   * To observe for changing element's "data" attribute.
   */
  watch(callback) {
    this._each(el =>
      this._isChangeable(el) &&
      this._on(el, this._getChangeEvent(el), callback)
    );

    return this;
  }
}
