'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template:
      '<ul ng-show=" items ">' +
      '  <li ng-repeat=" it in items ">' +
      '    {{ it.name }}' +
      '  </li>' +
      '</ul>' +
      '<p ng-hide=" items ">{{ emptyText }}</p>',

    controller: function($scope){
      $scope.emptyText = 'No items found';
    }
  });
};