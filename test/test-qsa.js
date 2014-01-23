'use strict';

var
  assert = require('assert'),
  angular = require('angular'),
  ngWidgets = require('..')
;

describe('angular.element().find()', function(){
  var el = angular.element('<test><div class="test"><span>test</span></div></test>');

  it('resolves by tagName', function(){
    assert(el.find('div').length, 'no span found');
    assert(el.find('span').length, 'no span found');

    assert(el.find('div, span').length === 2, '2 elements expected');
  });

  it('resolves by classes, attributes, etc.', function(){
    assert(el.find('.test').length, 'no .test found');
    assert(el.find('[class=test]').length, 'no [class=test] found');
  });

  it('is still chainable', function(){
    assert(el.find('.test').hasClass('test'));
  });
});