'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template:
      '<div class="form-group" ng-class=" {\'has-error\': ngModel.$dirty && ngModel.$invalid} ">' +
      '  <label ng-show=" label " class="control-label">{{ label }}</label>' +
      '  <content></content>' +

      '  <p class="help-block">' +
      '    {{ help }}' +
      '  </p>' +

      '  <ul class="help-block" ng-show=" ngModel.$dirty " style=" font-weight: bold ">' +
      '    <li ng-repeat=" (k, e) in ngModel.$error " ng-show=" e ">{{ messages[k] || k }}</li>' +
      '  </ul>' +
      '</div>',

    messages: {
      'required': 'This field is required',
      'minlength': 'Too short',
      'maxlength': 'Too long'
    },

    label: '',
    help: '',

    init: function($scope, $element, $timeout){
      $timeout(function(){
        $scope.ngModel = $element.find('content').children().addClass('form-control').controller('ngModel');
      });
    }
  });
};