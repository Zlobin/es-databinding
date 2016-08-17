import Observer from './';

export default class DomObserver extends Observer {
  constructor(dom) {
    this.dom = dom;
  }

  update(el, value, transformedValue) {
    this.dom()
      .find(el)
      .set(value, transformedValue);
  }
}
