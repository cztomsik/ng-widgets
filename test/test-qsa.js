'use strict';

var
  assert = require('assert'),
  example = require('./runner/example')
;

describe('angular.element().find()', function(){
  var
    $element = example(
      '<main>' +
      '  <div class="test">' +
      '    <span>test</span>' +
      '  </div>' +
      '</main>'
    )
  ;

  it('resolves by tagName', function(){
    assert($element.find('div').length, 'no span found');
    assert($element.find('span').length, 'no span found');

    assert($element.find('div, span').length === 2, '2 elements expected');
  });

  it('resolves by classes, attributes, etc.', function(){
    assert($element.find('.test').length, 'no .test found');
    assert($element.find('[class=test]').length, 'no [class=test] found');
  });

  it('is still chainable', function(){
    assert($element.find('.test').hasClass('test'));
  });

  it('degrades gracefully with empty result', function(){
    var ghost = $element.find('not-found');

    assert(ghost.length === 0);
    assert(ghost.text() === '');
    assert( ! ghost.hasClass('test'));
  });
});