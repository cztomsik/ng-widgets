'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    controller: function($scope){
      $scope.template = function(){
        return this.html || ('{{ it["' + this.index + '"] }}');
      };
    },

    link: function($scope){
      $scope.html = $scope.$host.find('template').html();

      $scope.$emit('coladd', $scope);
    }
  });
};