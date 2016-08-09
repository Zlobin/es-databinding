let dependencies = {
  'object': [
    'assign',
    'keys',
    'defineProperty'
  ],
  'array': [
    'isArray',
    'forEach',
    'every'
  ],
  'document': [
    'querySelectorAll'
  ]
};

const checkDep = (obj, method) => {
  let checkObj;

  if (obj === 'object') {
    checkObj = Object;
  } else if (obj === 'array') {
    checkObj = Array;
  } else if (obj === 'document') {
    checkObj = document;
  }

  if (!checkObj.hasOwnProperty(method) ||
    !checkObj.prototype.hasOwnProperty(method)) {
    throw new Error(`${method} method in ${obj} is not available.`);
  }
};

export const checkAllDependencies = () => {
  for (let key in dependencies) {
    if (dependencies.hasOwnProperty(key)) {
      for (let i = 0; i < dependencies[key].length; i++) {
        checkDep(key, dependencies[key][i]);
      }
    }
  }

  dependencies = null;
};
