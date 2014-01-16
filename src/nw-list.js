'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template:
      '<ul ng-show=" items " class="{{listClass}}">' +
      '  <li ng-repeat=" it in items " ng-class=" { {{activeClass}}: ngModel.$modelValue == it} ">' +
      '    <a href="" ng-click=" ngModel.$setViewValue(it) ">{{ it.name }}</a>' +
      '  </li>' +
      '</ul>' +
      '<p ng-hide=" items " class="empty-text">{{ emptyText }}</p>',

    items: [],
    emptyText: '',
    listClass: 'list-unstyled',
    activeClass: 'active',

    autoselect: false,

    init: function($scope, $element){
      $scope.ngModel = $element.controller('ngModel');

      //TODO: mixin?
      $scope.$watch('autoselect && items && ( ! ngModel.$modelValue)', function(result){
        return result && $scope.ngModel.$setViewValue($scope.firstItem());
      });
    },

    firstItem: function(){
      return this.items[ Object.keys(this.items)[0] ];
    }
  });
};