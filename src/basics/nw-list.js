'use strict';

var
  _ = require('../utils/utils')
;

module.exports = function(ngWidget){
  return ngWidget({
    template:
      '<content></content>' +
      '<ul ng-show=" items " class="{{ listClass }}">' +
      '  <li ng-repeat=" it in items " ng-class="{ {{ activeClass }}: it == ngModel.$modelValue }">' +
      '    <a href="" ng-click=" ngModel.$setViewValue(it) ">{{ it.name }}</a>' +
      '  </li>' +
      '</ul>' +
      '<p ng-hide=" items ">{{ emptyText }}</p>',

    defaults: {
      items: [],
      emptyText: 'No items found',
      activeClass: 'active',
      listClass: '',
      autoselect: false
    },

    controller: function($scope){
      var
        listCtrl = this
      ;

      listCtrl.addItem = function(item){
        $scope.items.push(item);
      };

      listCtrl.removeItem = function(item){
        _.pull($scope.items, item);
      };
    },

    link: function($scope, $element){
      $scope.ngModel = $element.controller('ngModel');

      $scope.$watch('ngModel && ( ! ngModel.$modelValue) && autoselect && items', function(items){
        if (items){
          $scope.ngModel.$setViewValue(items[Object.keys(items)[0]]);
        }
      });
    }
  });
};