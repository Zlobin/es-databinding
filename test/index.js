import expect from 'expect';

import ObjectPath from '../src/utils/object_path';
// import DOM from '../src/dom/';
// import DataBinder from '../src/data_binding';

// Delimiter.
const _d_ = '.';

describe('1. ObjectPath', function() {
  const state = {
    user: {
      firstName: 'John',
      lastName: 'Doe',
      skills: [
        'js',
        'css',
        'html'
      ]
    }
  };
  const objectPath = new ObjectPath(state);

  it('1.1: "split" method should work correct', () => {
    const split = objectPath.split(`user${_d_}firstName`);
    const split2 = objectPath.split(`user${_d_}skills${_d_}0`);
    const split3 = objectPath.split(`user${_d_}skills[0]`);

    expect(split).toEqual(['user', 'firstName']);
    expect(split2).toEqual(['user', 'skills', '0']);
    expect(split3).toEqual(['user', 'skills', '0']);
  });

  it('1.2: "get" method should work correct', () => {
    expect(objectPath.get(`user${_d_}firstName`)).toEqual('John');
    expect(objectPath.get(`user${_d_}lastName`)).toEqual('Doe');
    expect(objectPath.get(`user${_d_}skills${_d_}0`)).toEqual('js');
    expect(objectPath.get(`user${_d_}skills[0]`)).toEqual('js');
    expect(objectPath.get(`user${_d_}skills.2`)).toEqual('html');
    expect(objectPath.get(`user${_d_}skills[2]`)).toEqual('html');
  });

  it('1.3: "set" method should work correct', () => {
    expect(objectPath.get(`user${_d_}firstName`)).toEqual('John');
    objectPath.set(`user${_d_}firstName`, 'Igor');
    expect(objectPath.get(`user${_d_}firstName`)).toEqual('Igor');

    expect(objectPath.get(`user${_d_}skills${_d_}0`)).toEqual('js');
    objectPath.set(`user${_d_}skills${_d_}0`, 'es');
    expect(objectPath.get(`user${_d_}skills${_d_}0`)).toEqual('es');

    expect(objectPath.get(`user${_d_}skills[0]`)).toEqual('es');
    objectPath.set(`user${_d_}skills[0]`, 'es2015');
    expect(objectPath.get(`user${_d_}skills[0]`)).toEqual('es2015');

  });
});

describe('2. Dom', function() {
  // @todo
});

describe('3. DataBinder', function() {
  // @todo
});
