'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template:
      '<ul ng-show=" items " class="{{listClass}}">' +
      '  <li ng-repeat=" it in items " ng-class=" { {{activeClass}}: ngModel.$modelValue == it} ">' +
      '    <a href="javascript:void(0)" ng-click=" ngModel.$setViewValue(it) ">{{ it.name }}</a>' +
      '  </li>' +
      '</ul>',

    items: [],
    emptyText: '',
    listClass: 'list-unstyled',
    activeClass: 'active',

    autoselect: false,

    init: function($scope, $element){
      $scope.ngModel = $element.controller('ngModel');

      //TODO: mixin? dependent on ng-options?
      if (this.autoselect){
        this.$watch('items', this.autoselectFirst.bind(this));
      }
    },

    autoselectFirst: function(){
      return this.ngModel && ( ! this.ngModel.$modelValue ) && this.ngModel.$setViewValue(this.items[ Object.keys(this.items)[0] ]);
    }
  });
};