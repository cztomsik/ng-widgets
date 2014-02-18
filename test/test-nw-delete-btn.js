'use strict';

var
  assert = require('assert'),
  example = require('./runner/example.js')
;

describe('nw-delete-btn', function(){
  var
    user = {
      $delete: function(){
        this.deleted = true;
      }
    },
    $element = example('<nw-delete-btn record=" user "></nw-delete-btn>', {user: user}),
    btn = $element.find('nw-btn')
  ;

  it('renders empty btn with trash icon', function(){
    assert.strictEqual(btn.text().trim(), '');
    assert.strictEqual(btn.attr('icon'), 'trash-o');
  });

  it('calls [record].$delete() on click', function(){
    btn.triggerHandler('click');

    assert(user.deleted);
  });
});