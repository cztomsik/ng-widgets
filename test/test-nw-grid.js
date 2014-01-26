'use strict';

var
  assert = require('assert'),
  example = require('./runner/example')
;

describe('<nw-grid', function(){
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
    $scope = el.scope()
  ;

  $scope.users = [
    {name: 'Admin'},
    {name: 'Joe Bloggs'},
    {name: 'John Doe'}
  ];
  $scope.$apply();

  it('renders .table with defined cols for all items', function(){
    var
      cols = el.find('thead th'),
      rows = el.find('tbody tr')
    ;

    assert(table.length);
    assert.equal(cols.length, 2);
    assert.equal(rows.length, 3);
  });

  it('TODO: test autosort, sortCol, reverse', function(){

  });
});