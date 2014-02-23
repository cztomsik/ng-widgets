'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    defaults: {
      name: ''
    },

    link: function($scope, $element, $attrs, ctrls){
      var
        listCtrl = ctrls[0]
      ;

      listCtrl.addItem($scope);

      $scope.$on('$destroy', listCtrl.removeItem.bind(listCtrl, $scope));
    }
  });
};