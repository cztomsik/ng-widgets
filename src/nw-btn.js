'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template: '<a class="btn btn-{{ type }}"><content></content></a>',

    defaults: {
      type: 'default'
    }
  });
};