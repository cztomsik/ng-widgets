'use strict';

var
  assert = require('assert'),
  example = require('../../example')
;

describe('<nw-grid', function(){
  var
    $element = example(
      '<nw-grid items=" users ">' +
      '  <nw-grid-col name="Name" index="name"></nw-grid-col>' +
      '  <nw-grid-col name="Actions">' +
      '    <template><a href="">Edit</a></template>' +
      '  </nw-grid-col>' +
      '</nw-grid>'
    ),
    table = $element.find('.table'),
    $scope = $element.scope()
  ;

  $scope.users = [
    {name: 'Admin'},
    {name: 'Joe Bloggs'},
    {name: 'John Doe'}
  ];
  $scope.$apply();

  it('renders .table with defined cols for all items', function(){
    var
      cols = $element.find('thead th'),
      rows = $element.find('tbody tr')
    ;

    assert.strictEqual(table.length, 1);
    assert.strictEqual(cols.length, 2);
    assert.strictEqual(rows.length, 3);
  });

  it('TODO: test autosort, sortCol, reverse', function(){

  });
});