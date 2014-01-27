'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    controller: function($scope){
      $scope.template = function(){
        return this.html || ('{{ it["' + this.index + '"] }}');
      };
    },

    link: function($scope, $element, $attrs, ctrls, $transclude){
      //copy contents (TODO: $host)
      var tmp = $element.clone().html('');
      $transclude(this, tmp.append.bind(tmp));

      $scope.html = tmp.find('template').html();
    }
  });
};