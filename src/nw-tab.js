'use strict';

var
  _ = require('./utils')
;

//TODO: consider renaming to <nw-section
//  (introduce & support accordion)
module.exports = function(ngWidget){
  return ngWidget({
    template: '<content ng-show=" active "></content>',

    defaults: {
      name: ''
    },

    link: function($scope){
      $scope.$shadow.tabs.push($scope);

      $scope.$on('$destroy', function(){
        _.pull($scope.$shadow.tabs, $scope);
      });
    }
  });
};