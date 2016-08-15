import {
  areEqual,
  has
} from '../utils/lang';

// const Node = doc.documentElement.firstChild;
// const isDomElement = obj => isObject(obj) && obj.nodeType === Node.ELEMENT_NODE;

export default function elFacade(el) {
  return {
    /*
     * Determine in which attribute an element has data.
     */
    dataAttribute() {
      switch (el.nodeName) {
        case 'OPTION':
        case 'INPUT':
        case 'PROGRESS':
        case 'TEXTAREA':
          return 'value';
        default:
          return 'text';
      }
    },

    /*
     *
     */
    isChangeable() {
      return areEqual(this.dataAttribute(), 'value');
    },

    /*
     * Determine if an element - checkbox or radio.
     */
    isCheckOn() {
      return has(['checkbox', 'radio'], el.type);
    },

    /*
     *
     */
    isMultipleSelect() {
      return areEqual(el.type, 'select-multiple');
    },

    /*
     * Check if an element has "value" attribute.
     */
    hasValueData() {
      return has([
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
      ], el.type);
    },

    /*
     * Check if an element has "change" event.
     */
    hasChangeEvent() {
      return has([
        'checkbox',
        'radio',
        'select-one',
        'select-multiple',
        'password'
      ], el.type);
    },

    /*
     *
     */
    valueAttribute() {
      return this.isCheckOn() ?
        'checked' :
        'value';
    },

    /*
     *
     */
    getterMethod() {
      return this.isChangeable() ?
        'value' :
        'text';
    },

    /*
     * Determine which event should be listened.
     */
    getChangeEvent() {
      if (this.hasValueData()) {
        return 'input';
      } else if (this.hasChangeEvent()) {
        return 'change';
      }

      return null;
    },

    el() {
      return el.target || el;
    }
  };
}
