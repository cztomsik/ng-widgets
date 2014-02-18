'use strict';

var
  assert = require('assert'),
  example = require('./runner/example')
;

describe('showdown', function(){
  var
    $element = example('<div ng-bind-html=" \'**test**\' | markdown "></div>')
  ;

  it('converts markdown to html', function(){
    assert.strictEqual($element.html(), '<p><strong>test</strong></p>');
  });
});