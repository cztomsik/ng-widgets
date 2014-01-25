'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template:
      '<ul ng-show=" itemsColl " class="{{ listClass }}">' +
      '  <li ng-repeat=" it in itemsColl ">' +
      '    {{ it.name }}' +
      '  </li>' +
      '</ul>' +
      '<p ng-hide=" itemsColl ">{{ emptyText }}</p>',

    controller: function($scope){
      $scope.emptyText = 'No items found';
    },

    link: function($scope){
      $scope.$parent.$watchCollection($scope.items, function(itemsColl){
        $scope.itemsColl = itemsColl || [];
      });

      //if ('autoselect' in $scope){
      //
      //}
    }
  });
};