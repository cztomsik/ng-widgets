'use strict';

var
  assert = require('assert'),
  example = require('./runner/example')
;

describe('nw-grid', function(){
  var
    el = example(
      '<nw-grid items=" users ">' +
      '  <nw-grid-col name="Name" index="name"></nw-grid-col>' +
      '  <nw-grid-col name="Actions">' +
      '    <template><a href="">Edit</a></template>' +
      '  </nw-grid-col>' +
      '</nw-grid>'
    ),
    table = el.find('.table'),
    rows = el.find('tbody tr')
  ;

  el.isolateScope().users = [
    {name: 'Admin'},
    {name: 'Joe Bloggs'},
    {name: 'John Doe'}
  ];

  /*
  TODO: $timeout transclude
  it('renders .table with 3 rows', function(){
    assert(table.length);
    assert(rows.length === 3);
  });
  */
});