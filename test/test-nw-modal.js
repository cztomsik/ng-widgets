'use strict';

var
  assert = require('assert'),
  example = require('./runner/example')
;

describe('<nw-modal', function(){
  var
    $element = example(
      '<nw-modal>' +
      '  Nameless modal' +
      '</nw-modal>' +
      '<br>' +
      '<nw-modal name="Named modal">' +
      '  Modal body' +
      '</nw-modal>'
    ),

    modal = $element.find('.modal'),

    namelessModal = modal.eq(0),
    namedModal = modal.eq(1),

    namelessHeader = namelessModal.find('.modal-header'),
    namelessBody = namelessModal.find('.modal-body'),

    namedHeader = namedModal.find('.modal-header'),
    namedBody = namedModal.find('.modal-body')
  ;

  it('renders .modal', function(){
    assert.equal(modal.length, 2);
    assert.equal(modal.find('.modal-dialog > .modal-content > .modal-body').length, 2);
    assert.equal(modal.find('.modal-dialog > .modal-content > .modal-header > .modal-title').length, 2);

  });

  it('shows [name] in .modal-header>.modal-title', function(){
    assert(namelessHeader.hasClass('ng-hide'));
    assert.equal(namelessHeader.text().trim(), '');

    assert( ! namedHeader.hasClass('ng-hide'));
    assert.equal(namedHeader.text().trim(), 'Named modal');
  });

  it('shows content in .modal-body', function(){
    assert.equal(namelessBody.text().trim(), 'Nameless modal');
    assert.equal(namedBody.text().trim(), 'Modal body');
  });
});