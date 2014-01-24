'use strict';

var
  assert = require('assert'),
  example = require('./runner/example')
;

describe('nw-modal', function(){
  var
    el = example('<nw-modal name="Hello">Hello World</nw-modal>'),
    modal = el.find('.modal'),
    modalDialog = modal.find('.modal-dialog'),
    modalContent = modalDialog.find('.modal-content'),
    modalBody = modalDialog.find('.modal-body'),
    modalHeader = modalDialog.find('.modal-header'),
    modalTitle = modalDialog.find('.modal-title')
  ;

  it('renders .modal>.modal-dialog>.modal-content', function(){
    assert(modal.length);
    assert(modalDialog.length);
    assert(modalContent.length);
  });

  it('shows [name] in .modal-title', function(){
    assert.equal(modalTitle.text(), 'Hello');
  });

  it('shows content in .modal-body', function(){
    assert.equal(modalBody.text().trim(), 'Hello World');
  });

  it('.modal-header hidden when empty', function(){
    assert( ! modalHeader.hasClass('ng-hide'));

    el.isolateScope().name = '';
    el.isolateScope().$apply();

    assert(modalHeader.hasClass('ng-hide'));
  });
});