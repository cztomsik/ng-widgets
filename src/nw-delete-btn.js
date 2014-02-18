'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template: '<nw-btn icon="trash-o" ng-click=" record.$delete() "></nw-btn>',

    defaults: {
      record: {}
    }
  });
};