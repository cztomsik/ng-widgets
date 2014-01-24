'use strict';

var
  assert = require('assert'),
  example = require('./runner/example')
;

describe('nw-list', function(){
  var
    el = example(
      '<nw-list items=" users " empty-text="No items">' +
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

  // it('renders unordered list, with 2 items', function(){
  //   var listItems = list.find('li');

  //   assert(list.length);
  //   assert(listItems.length === 2);
  // });

  it('emptyText is shown instead of empty list', function(){
    el.isolateScope().items = [];
    el.isolateScope().$apply();

    assert(list.hasClass('ng-hide'));
    assert.equal(el.text().trim(), 'No items');
  });
});