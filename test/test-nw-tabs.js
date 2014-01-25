'use strict';

var
  assert = require('assert'),
  example = require('./runner/example')
;

describe('<nw-tabs', function(){
  var
    el = example(
      '<nw-tabs>' +
      '  <nw-tab>One</nw-tab>' +
      '  <nw-tab>Two</nw-tab>' +
      '</nw-tabs>'
    ),

    tabs = el.find('.nav-tabs'),
    one = el.find('nw-tab').eq(0),
    two = el.find('nw-tab').eq(1)
  ;

/*  it('renders .nav.nav-tabs', function(){
    assert(tabs.length);
  });

  it('shows first tab, hides any other ones', function(){
    assert( ! one.hasClass('ng-hide'));
    assert( two.hasClass('ng-hide'));
  });*/
});