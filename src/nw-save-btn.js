'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template: '<nw-btn icon="save" ng-click=" record.$save() "></nw-btn>',

    defaults: {
      record: {}
    }
  });
};