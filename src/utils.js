export const doc = document;

const Node = doc.documentElement.firstChild;
const toString = Object.prototype.toString;

export const isObject = obj => toString.call(obj) === '[object Object]';
export const isDomElement = obj => isObject(obj) && obj.nodeType === Node.ELEMENT_NODE;
export const isString = str => toString.call(str) === '[object String]';
export const isNumber = num => toString.call(num) === '[object Number]';
export const isArray = Array.isArray;
export const isNull = obj => obj === null;
export const isFunction = func => toString.call(func) === '[object Function]';

export const clone = obj => Object.assign({}, obj);
export const each = (obj, callback) => Object
  .keys(obj)
  .forEach(key => callback(key));

export const areEqual = (p1, p2) => {
  // Compare two arrays.
  if (isArray(p1) && isArray(p2)) {
    let len = p1.length;

    if (len !== p2.length) {
      return false;
    }

    while (len--) {
      if (!isArray(p1[len]) && !isArray(p2[len])) {
        if (p1[len] !== p2[len]) {
          return false;
        }
      } else if (isArray(p1[len]) && isArray(p2[len])) {
        if (!areEqual(p1[len], p2[len])) {
          return false;
        }
      }
    }

    return true;
  // Compare two objects.
  } else if (isObject(p1) && isObject(p2)) {
    return Object
      .keys(p1)
      .every(val =>
        (isObject(p1[val]) && isObject(p2[val])) ||
        (isArray(p1[val]) && isArray(p2[val])) ?
          areEqual(p1[val], p2[val]) :
          p1[val] === p2[val]
      );
  } else {
    return p1 === p2;
  }
};
