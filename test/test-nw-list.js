'use strict';

var
  assert = require('assert'),
  example = require('./runner/example')
;

describe('<nw-list', function(){
  var
    $element = example(
      '<nw-list items=" users " list-class="list-unstyled" empty-text="No items" ng-model=" selectedUser "></nw-list>'
    ),
    $scope = $element.scope(),

    list = $element.find('ul'),

    users = [
      {name: 'Admin'},
      {name: 'Test'}
    ]
  ;

  $scope.users = users;
  $scope.$apply();

  it('renders unordered list, with item names', function(){
    var listItems = list.find('li');

    assert.strictEqual(list.length, 1);
    assert.strictEqual(listItems.length, 2);

    assert.strictEqual(listItems.eq(0).text().trim(), 'Admin');
    assert.strictEqual(listItems.eq(1).text().trim(), 'Test');
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
    assert.strictEqual($element.text().trim(), 'No items');
  });
});