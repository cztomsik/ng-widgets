'use strict';

var
  assert = require('assert'),
  example = require('./runner/example')
;

describe('nw-modal', function(){
  var
    el = example('<nw-modal name="Hello">Hello World</nw-modal>'),
    modal = el.find('.modal'),
    dialog = modal.find('.modal-dialog'),
    content = dialog.find('.modal-content')
  ;

  it('renders .modal>.modal-dialog>.modal-content', function(){
    assert(modal.length);
    assert(dialog.length);
    assert(content.length);
  });
});