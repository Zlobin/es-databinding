const toString = Object.prototype.toString;

export const and = conditions => (...args) =>
  args.every(arg =>
    conditions.every(fn => fn(arg)));

export const or = condition => param =>
  condition.some(fn => fn(param));

export const noop = () => {};
export const isObject = obj => toString.call(obj) === '[object Object]';
export const isString = str => toString.call(str) === '[object String]';
export const isNumber = num => toString.call(num) === '[object Number]';
export const isUndefined = obj => obj === undefined;
export const isArray = Array.isArray;
export const isNull = obj => obj === null;
export const isBlank = obj => isUndefined(obj) || isNull(obj);
export const isEmpty = obj => isBlank(obj) || obj === '';
export const isFunction = func => toString.call(func) === '[object Function]';
export const hasProperty = (obj, prop) =>
  Object.prototype.hasOwnProperty.call(obj, prop);
export const has = (arr, needle) => arr.indexOf(needle) >= 0;
/* eslint-disable no-param-reassign */
export const setGet = (obj, attr, value) =>
  (isUndefined(value) ?
    obj[attr] :
    (obj[attr] = value));
/* eslint-enable no-param-reassign */

export const defineProperty = (obj, key, setter = noop, getter = noop) => {
  function defineSetter(newValue) {
    setter.bind(this)(newValue);
  }

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    set: defineSetter,
    get: getter
  });
};

export const clone = obj => Object.assign({}, obj);
export const each = (obj, callback) => Object
  .keys(obj)
  .forEach(key => callback(key));

export const areEqual = (p1, p2) => {
  // Compare two arrays.
  if (and([isArray])(p1, p2)) {
    // if (isArray(p1) && isArray(p2)) {
    let i = p1.length;

    if (!areEqual(i, p2.length)) {
      return false;
    }

    while (i--) {
      if (!areEqual(p1[i], p2[i])) {
        return false;
      }
    }

    return true;
    // Compare two objects.
  } else if (and([isObject])(p1, p2)) {
  // } else if (isObject(p1) && isObject(p2)) {
    return Object
      .keys(p1)
      .every(val => areEqual(p1[val], p2[val]));
  }

  return p1 === p2;
};
