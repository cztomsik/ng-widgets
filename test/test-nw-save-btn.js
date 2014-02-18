'use strict';

var
  assert = require('assert'),
  example = require('./runner/example.js')
;

describe('nw-save-btn', function(){
  var
    user = {
      $save: function(){
        this.saved = true;
      }
    },
    $element = example('<nw-save-btn record=" user "></nw-save-btn>', {user: user}),
    btn = $element.find('nw-btn')
  ;

  it('renders empty btn with trash icon', function(){
    assert.strictEqual(btn.text().trim(), '');
    assert.strictEqual(btn.attr('icon'), 'save');
  });

  it('calls [record].$save() on click', function(){
    btn.triggerHandler('click');

    assert(user.saved);
  });
});