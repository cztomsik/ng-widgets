'use strict';

module.exports = {
  restrict: 'E',
  template:
    '<div class="form-group" ng-class=" {\'has-error\': ngModel.$dirty && ngModel.$invalid} ">' +
    '  <label ng-show=" label " class="control-label">{{ label }}</label>' +
    '  <content></content>' +
    '' +
    '  <p class="help-block">' +
    '    {{ help }}' +
    '  </p>' +
    '' +
    '  <ul class="help-block" ng-show=" ngModel.$dirty " style=" font-weight: bold ">' +
    '    <li ng-repeat=" (k, e) in ngModel.$error " ng-show=" e ">This field is {{ k }}</li>' +
    '  </ul>' +
    '</div>',
  transclude: true,
  scope: {
    label: '@'
  },
  controller: function($scope, $element, $timeout){
    $timeout(function(){
      $scope.ngModel = $element.find('content').children().addClass('form-control').controller('ngModel');
    });
  }
};