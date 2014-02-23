'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    require: ['^nwGrid'],

    template: '<content></content>',

    defaults: {
      name: '',
      index: ''
    },

    controller: function($scope){
      $scope.template = function(){
        return this.html || ('{{ it["' + this.index + '"] }}');
      };
    },

    link: function($scope, $element, $attrs, ctrls){
      var
        gridCtrl = ctrls[0]
      ;

      gridCtrl.addCol($scope);

      $scope.$on('$destroy', gridCtrl.removeCol.bind(gridCtrl, $scope));

      $scope.html = $element.find('template').html();
    }
  });
};