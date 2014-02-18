'use strict';

var
  assert = require('assert'),
  example = require('./runner/example')
;

describe('<nw-lipsum', function(){
  var
    $element = example('<nw-lipsum></nw-lipsum>'),
    paragraph = $element.find('p')
  ;

  it('shows paragraph of lorem ipsum', function(){
    assert.strictEqual(paragraph.length, 1);
    assert.strictEqual($element.text().slice(0, 11), 'Lorem ipsum');
  });
});