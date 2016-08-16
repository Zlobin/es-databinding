import {
  areEqual,
  has
} from '../utils/lang';

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
     * If DOM element is changeable.
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
     * If it's multiple select @todo
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
     * Checkbox and radio has checked instead of value.
     */
    valueAttribute() {
      return this.isCheckOn() ?
        'checked' :
        'value';
    },

    /*
     * Attribute for getting data.
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
    }
  };
}
