'use strict';

var
  assert = require('assert'),
  example = require('../../example')
;

describe('<nw-grid', function(){
  var
    users = [
      {name: 'Not shown because of offset'},
      {name: 'Admin'},
      {name: 'Joe Bloggs'},
      {name: 'John Doe'},
      {name: 'Not shown because of limit'}
    ],
    $element = example(
      '<nw-grid items=" users " limit="3" offset="1">' +
      '  <nw-grid-col name="Name" index="name"></nw-grid-col>' +
      '  <nw-grid-col name="Actions">' +
      '    <template><a href="">Edit</a></template>' +
      '  </nw-grid-col>' +
      '</nw-grid>',
      {users: users}
    ),
    table = $element.find('.table'),
    cols = $element.find('thead th'),
    rows = $element.find('tbody tr')
  ;

  it('shows .table with defined cols', function(){
    assert.strictEqual(table.length, 1);
    assert.strictEqual(cols.length, 2);
  });

  it('filters rows using limit and offset', function(){
    assert.strictEqual(rows.length, 3);
    assert.strictEqual(rows.eq(0).text().trim(), 'AdminEdit');
  });
});