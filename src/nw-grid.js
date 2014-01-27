'use strict';

var angular = require('angular');

module.exports = function(ngWidget){
  return ngWidget({
    style:
      //hand + unselectable
      'nw-grid thead th{cursor: pointer; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none}' +
      'nw-grid[ng-model] tbody tr{cursor: pointer}' +

      //carret visibility
      'nw-grid th i.fa{visibility: hidden}' +
      'nw-grid th.active i.fa{visibility: visible}' +

      //bootstrap bug? striped + hover + active
      'nw-grid tr.active td{background: #68c !important; color: #fff !important}',

    template:
      //transclude columns (TODO: make ngWidget() automatically transclude everything)
      '<content></content>' +

      '<table class="table table-striped table-hover table-bordered">' +
      '  <thead>' +
      '    <tr>' +
      '    <th' +
      '      ng-repeat=" col in cols " ' +
      '      ng-class=" {active: col == sortCol} " ' +
      '      ng-click=" $parent.reverse = ((col == sortCol) && !reverse); $parent.sortCol = col " ' +
      '    >' +
      '      {{ col.name }} ' +
      '      <i class="fa fa-caret-{{ reverse ?\'down\' :\'up\' }} pull-right"></i>' +
      '    </th>' +
      '    </tr>' +
      '  </thead>' +
      '  <tbody>' +
      '    <tr><td>Value</td></tr>' +
      '  </tbody>' +
      '</table>',

    defaults: {
      cols: [],
      autosort: true
    },

    controller: function($scope){
      $scope.$watch('cols', function(){
        if ($scope.autosort){
          $scope.sortCol = $scope.cols[0];
        }
      });
    },

    link: function($scope, $element){
      //initialize using elements
      var
        colEls = $element.find('nw-grid-col'),
        tr = $element.find('tbody tr'),
        trHtml = ''
      ;

      //TODO: this should be in controller, but its too early (attributes are not bound)
      //  [] support might solve this
      $scope.$parent.$watchCollection($scope.items, function(itemsColl){
        $scope.itemsColl = itemsColl || [];
      });

      //TODO: this is nasty, would be much better to get all hostElement scopes in array
      angular.forEach(colEls, function(colEl){
        $scope.cols.push(angular.element(colEl).isolateScope());
      });

      //init repeater
      tr.attr('ng-repeat', ' it in itemsColl | orderBy:sortCol.index:reverse ');

      $scope.cols.forEach(function(col){
        trHtml += '<td>' + col.template() + '</td>';
      });

      //TODO: find better way to compile new elements in link phase
      $element.injector().get('$compile')(tr.html(trHtml))($scope);
    }
  });
};