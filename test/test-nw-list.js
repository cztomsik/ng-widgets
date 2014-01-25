'use strict';

var
  assert = require('assert'),
  example = require('./runner/example')
;

describe('<nw-list', function(){
  var
    el = example(
      '<nw-list items=" users " list-class="nav" empty-text="No items">' +
      '  <template>{{ it.name }}</template>' +
      '</nw-list>'
    ),
    list = el.find('ul')
  ;

  el.scope().users = [
    {name: 'Admin'},
    {name: 'Test'}
  ];
  el.scope().$apply();

  it('renders unordered list, with 2 items', function(){
    var listItems = list.find('li');

    assert(list.length);
    assert.equal(listItems.length, 2);
  });

  it('emptyText is shown instead of empty list', function(){
    el.scope().users = [];
    el.scope().$apply();

    assert(list.hasClass('ng-hide'));
    assert.equal(el.text().trim(), 'No items');
  });

  it('adds [list-class] to list', function(){
    assert(list.hasClass('nav'));
  });
});