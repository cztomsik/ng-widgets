'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template:
      '<a class="btn btn-{{ type }}">' +
      '  <i class="fa fa-{{ icon }}" ng-show=" icon "></i>' +
      '  {{ name }}' +
      '</a>',

    defaults: {
      name: '',
      icon: '',
      type: 'default'
    }
  });
};