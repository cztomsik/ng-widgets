'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template:
      '<ul ng-show=" itemsColl " class="{{ listClass }}">' +
      '  <li ng-repeat=" it in itemsColl " ng-class="{ {{ activeClass }}: it == ngModel.$modelValue }">' +
      '    <a href="" ng-click=" ngModel.$setViewValue(it) ">{{ it.name }}</a>' +
      '  </li>' +
      '</ul>' +
      '<p ng-hide=" itemsColl ">{{ emptyText }}</p>',

    controller: function($scope){
      $scope.emptyText = 'No items found';
      $scope.activeClass = 'active';
    },

    link: function($scope, $element){
      $scope.ngModel = $element.controller('ngModel');

      $scope.$parent.$watchCollection($scope.items, function(itemsColl){
        $scope.itemsColl = itemsColl || [];
      });

      //if ('autoselect' in $scope){
      //
      //}
    }
  });
};