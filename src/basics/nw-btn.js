'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template:
      '<a class="btn btn-{{ type }}" ng-class=" {disabled: ngDisabled} ">' +
      '  <i class="fa fa-{{ icon }}" ng-show=" icon "></i>' +
      '  {{ name }}' +
      '</a>',

    defaults: {
      name: '',
      icon: '',
      type: 'default',
      ngDisabled: false
    },

    link: function($scope, $element){
      $element.on('click', function($event){
        if ($scope.ngDisabled){
          $event.stopImmediatePropagation();
        }
      });
    }
  });
};