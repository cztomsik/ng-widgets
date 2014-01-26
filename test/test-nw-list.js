'use strict';

var
  assert = require('assert'),
  example = require('./runner/example')
;

describe('<nw-list', function(){
  var
    el = example(
      '<nw-list items=" users " list-class="list-unstyled" empty-text="No items" ng-model=" selectedUser "></nw-list>'
    ),
    list = el.find('ul'),

    $scope = el.scope(),

    users = [
      {name: 'Admin'},
      {name: 'Test'}
    ]
  ;

  $scope.users = users;
  $scope.$apply();

  it('renders unordered list, with item names', function(){
    var listItems = list.find('li');

    assert(list.length);
    assert.equal(listItems.length, 2);

    assert.equal(listItems.eq(0).text().trim(), 'Admin');
    assert.equal(listItems.eq(1).text().trim(), 'Test');
  });

  it('clicking sets item to ng-model', function(){
    var handles = list.find('li a');

    handles.eq(0).triggerHandler('click');
    assert.strictEqual($scope.selectedUser, users[0]);

    handles.eq(1).triggerHandler('click');
    assert.strictEqual($scope.selectedUser, users[1]);
  });

  it('adds [list-class] to list', function(){
    assert(list.hasClass('list-unstyled'));
  });

  it('adds [activeClass] to active list item', function(){
    var items = list.find('li');

    assert(items.eq(1).hasClass('active'));
  });

  it('emptyText is shown instead of empty list', function(){
    $scope.users = [];
    $scope.$apply();

    assert(list.hasClass('ng-hide'));
    assert.equal(el.text().trim(), 'No items');
  });
});