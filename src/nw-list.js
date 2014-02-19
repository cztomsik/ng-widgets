'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template:
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
      listClass: ''
    },

    link: function($scope, $element){
      $scope.ngModel = $element.controller('ngModel');

      //if ('autoselect' in $scope){
      //
      //}
    }
  });
};