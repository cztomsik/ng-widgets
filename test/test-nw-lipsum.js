'use strict';

var
  assert = require('assert'),
  example = require('./runner/example')
;

describe('<nw-lipsum', function(){
  var
    el = example('<nw-lipsum></nw-lipsum>'),
    paragraph = el.find('p')
  ;

  it('shows paragraph of lorem ipsum', function(){
    assert(paragraph.length);
    assert.equal(el.text().slice(0, 11), 'Lorem ipsum');
  });
});