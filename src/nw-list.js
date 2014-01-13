'use strict';

module.exports = {
  restrict: 'E',
  template:
    '<ul ng-show=" items " class="{{listClass}}">' +
    '  <li ng-repeat=" it in items " ng-class=" { {{activeClass}}: ngModel.$modelValue == it} ">' +
    '    <a href="javascript:void()" ng-click=" ngModel.$setViewValue(it) ">{{ it.name }}</a>' +
    '  </li>' +
    '</ul>',
  scope: {
    emptyText: '@',
    listClass: '@',
    activeClass: '@'
  },
  controller: function($scope, $attrs, $element){
    $scope.emptyText = $scope.emptyText || 'No items found';
    $scope.listClass = $scope.listClass || 'list-unstyled';
    $scope.activeClass = $scope.activeClass || 'active';
    $scope.items = [];

    $scope.ngModel = $element.controller('ngModel');

    $scope.$parent.$watchCollection($attrs.items, function(items){
      $scope.items = items;
    });
  }
};