'use strict';

var
  assert = require('assert'),
  angular = require('angular'),
  qsa = require('../src/qsa')
;

describe('angular.element().qsa()', function(){
  var el = angular.element('<div><div class="test"><span>test</span></div></div>');

  it('resolves what .find() does', function(){
    assert(el.find('span').length === 1, 'no span found');
    assert(el.qsa('span').length === 1, 'no span found');
  });

  it('resolves even classes', function(){
    assert(el.qsa('.test').length === 1, 'no div.test found');
  });

  it('works with hasClass()', function(){
    assert(el.qsa('.test').hasClass('test') === true, '.test does not know about its class');
  });
});