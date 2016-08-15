# Two way data binding in JavaScript [![Build Status](https://travis-ci.org/Zlobin/es-databinding.png?branch=master)](https://travis-ci.org/Zlobin/es-databinding)

## Synopsis

es-databinding (DataBinder) - two-way data binding library.

## Installation

`npm i --save es-databinding`<br>
or<br>
`git clone https://github.com/Zlobin/es-databinding.git`<br>
`cd es-databinding && npm i && webpack`<br>

## Examples

```js
var userState = {
  firstName: 'John',
  lastName: 'Doe',
  fullName: '',
  sex: {
    active: 'M',
    data: {
      m: 'Man',
      w: 'Woman'
    }
  }
};

var cartState = {
  total: 0,
  items: [
    'Item 1',
    'Item 2',
    'Item 3'
  ]
};

var binding = {
  'user.sex.active': 'span.active',
  'user.firstName': '#first-name',
  'user.fullName': {
    // DOM element.
    el: '#fullName',
    callback: function() {
      // Will be called after changing element value.
    },
    parse: function() {
      // When apply from DOM to state.
    },
    transform: function(data) {
      // When applying from state to DOM.
      // Show how to transform data.
      // Example:
      // return `${data.value} USD`;
    }
  },
  'cart.items': '.cart-items',
  'cart.total': '#cart-total'
};

var binder = DataBinder(
  {
    user: userState,
    cart: cartState
  },
  binding
);
```

Manual changing state.
```js
binder.state.user.firstName = 'John';
```

Export
```
binder.export();
```

Pros:
1. No setTimeout ot setInterval.
2. No dependencies.
3. Small size ~6.5kb in packed, ~2kb gzipped.
4. Easy to maintain and to extend.
5. ES2015

TODO

1. Add tests.
2. Add more examples.
3. Add middleware pattern into setting value (to validating, for instance).
4. Add support for path like 'user.*.state'.
5. Add support for path like 'user.skills[0]', currently only 'user.skills.0'
6. Implement parse method.
7. Add benchmarks.
