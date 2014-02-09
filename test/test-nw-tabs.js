'use strict';

var
  assert = require('assert'),
  example = require('./runner/example')
;

describe('<nw-tabs', function(){
  var
    $element = example(
      '<nw-tabs>' +
      '  <nw-tab name="General">' +
      '    <p>General stuff</p>' +
      '    <nw-lipsum></nw-lipsum>' +
      '  </nw-tab>' +
      '  <nw-tab name="Other">' +
      '    <p>Other stuff</p>' +
      '  </nw-tab>' +
      '  <nw-tab ng-repeat=" it in items " name="{{ it.name }}">' +
      '    {{ it.name }}' +
      '  </nw-tab>' +
      '</nw-tabs>'
    ),

    $scope = $element.scope(),

    tabs = $element.find('.nav-tabs'),
    tabHandles = tabs.find('li a'),

    first = $element.find('nw-tab').eq(0),
    second = $element.find('nw-tab').eq(1)
  ;

  it('renders .nav.nav-tabs', function(){
    assert.equal(tabs.length, 1);
    assert.equal(tabHandles.length, 2);
  });

  it('shows tab names in handles', function(){
    assert.equal(tabHandles.eq(0).text(), 'General');
    assert.equal(tabHandles.eq(1).text(), 'Other');
  });

  it('clicking on handles will show respective tabs', function(){
    //check default
    assert( ! first.children().hasClass('ng-hide'));
    assert( second.children().hasClass('ng-hide'));

    //click second
    tabHandles.eq(1).triggerHandler('click');
    assert(first.children().hasClass('ng-hide'));
    assert( ! second.children().hasClass('ng-hide'));

    //click first
    tabHandles.eq(0).triggerHandler('click');
    assert( ! first.children().hasClass('ng-hide'));
    assert(second.children().hasClass('ng-hide'));
  });

  it('supports [ng-repeat]', function(){
    $scope.items = [{name: 'Test1'}, {name: 'Test2'}];
    $scope.$apply();

    assert.equal(tabs.find('li').length, 4);
  });
});