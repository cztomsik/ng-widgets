'use strict';

var
  assert = require('assert'),
  example = require('./runner/example')
;

describe('nw-list', function(){
  var
    el = example(
      '<nw-list items=" users ">' +
      '  <template>{{ it.name }}</template>' +
      '</nw-list>'
    ),
    list = el.find('ul')
  ;

  it('renders unordered list', function(){
    assert(list.length);
  });
});