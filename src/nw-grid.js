'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    style:
      //hand + unselectable
      'nw-grid thead th{cursor: pointer; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none}' +
      'nw-grid[ng-model] tbody tr{cursor: pointer}' +

      //bootstrap bug? striped + hover + active
      'nw-grid tr.active td{background: #68c !important; color: #fff !important}',

    template:
      '<table class="table table-striped table-hover table-bordered">' +
      '  <thead>' +
      '    <tr>' +
      '    <th' +
      '      ng-repeat=" col in cols " ' +
      '      ng-class=" {active: col == sortCol} " ' +
      '      ng-click=" $parent.reverse = ((col == sortCol) && !reverse); $parent.sortCol = col " ' +
      '    > ' +
      '      {{ col.name }} ' +
      '      <i ng-show=" col == sortCol " class="fa fa-caret-{{ reverse ?\'down\' :\'up\' }} pull-right"></i> ' +
      '    </th>' +
      '    </tr>' +
      '  </thead>' +
      '  <tbody>' +
      '    <tr><td>Value</td></tr>' +
      '  </tbody>' +
      '</table>',

    items: [],
    cols: [],
    sortCol: null,
    reverse: false,

    init: function($scope, $element, $timeout, $compile, $transclude){
      var
        tbody = $element.find('tbody'),
        tr = tbody.find('tr'),
        trHtml = ''
      ;

      //do not share
      $scope.cols = [];

      //init cols
      $transclude(this, function(){});

      //grid-col names not resolved yet (TODO: invoke ctrl after binding setup?)
      $timeout(function(){
        $scope.sortCol = $scope.sortCol || $scope.cols[0];

        //init repeater
        tr.attr('ng-repeat', ' it in items ');

        $scope.cols.forEach(function(col){
          trHtml += '<td>' + (col.template || ('{{ it["' + col.index + '"] }}')) + '</td>';
        });

        $compile(tr.html(trHtml))($scope);
      });

    }
  });
};