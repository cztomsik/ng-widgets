'use strict';

var
  _ = require('./utils')
;

module.exports = function(ngWidget){
  return ngWidget({
    defaults: {
      name: '',
      index: ''
    },

    controller: function($scope){
      $scope.template = function(){
        return this.html || ('{{ it["' + this.index + '"] }}');
      };
    },

    link: function($scope){
      $scope.$shadow.cols.push($scope);

      $scope.$on('$destroy', function(){
        _.pull($scope.$shadow.cols, $scope);
      });

      $scope.html = $scope.$host.find('template').html();
    }
  });
};