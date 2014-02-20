'use strict';

//TODO: consider renaming to <nw-section
//  (introduce & support accordion)
module.exports = function(ngWidget){
  return ngWidget({
    require: ['^nwTabs'],

    template: '<content ng-show=" active "></content>',

    defaults: {
      name: ''
    },

    link: function($scope, $element, $attrs, ctrls){
      var
        tabsCtrl = ctrls[0]
      ;

      tabsCtrl.addTab($scope);

      $scope.$on('$destroy', tabsCtrl.removeTab.bind(tabsCtrl, $scope));
    }
  });
};