'use strict';

var
  assert = require('assert'),
  example = require('../../example')
;

describe('showdown', function(){
  var
    $element = example(
      '<div ng-bind-html=" \'**test**\' | markdown "></div>' +
      '<div ng-bind-html=" \'<test@test.com>\' | markdown "></div>'
    ),

    first = $element.eq(0),
    second = $element.eq(1)
  ;

  it('converts markdown to html', function(){
    assert.strictEqual(first.html(), '<p><strong>test</strong></p>');
  });

  it('prevents email obfuscation (because of infinite digest)', function(){
    assert.strictEqual(second.html(), '<p><a href="mailto:test@test.com">test@test.com</a></p>');
  });
});