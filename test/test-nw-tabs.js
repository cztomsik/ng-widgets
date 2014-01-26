'use strict';

var
  assert = require('assert'),
  example = require('./runner/example')
;

describe('<nw-tabs', function(){
  var
    el = example(
      '<nw-tabs>' +
      '  <nw-tab name="General">' +
      '    <p>General stuff</p>' +
      '    <nw-lipsum></nw-lipsum>' +
      '  </nw-tab>' +
      '  <nw-tab name="Other">' +
      '    <p>Other stuff</p>' +
      '  </nw-tab>' +
      '</nw-tabs>'
    ),

    tabs = el.find('.nav-tabs'),
    tabHandles = tabs.find('li a'),

    first = el.find('nw-tab').eq(0),
    second = el.find('nw-tab').eq(1)
  ;

  it('renders .nav.nav-tabs', function(){
    assert(tabs.length);
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
});