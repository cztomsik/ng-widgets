'use strict';

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

    // # <nw-grid
    //     <nw-grid items=" users " ng-model=" user ">
    //       <nw-grid-col name="Name" index=" name "></nw-grid-col>
    //       <nw-grid-col name="Actions">
    //         <template>
    //           <a href="{{ it.editUrl }}">Edit</a>
    //         </template>
    //       </nw-grid-col>
    //     </nw-grid>
    template:
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

    items: [],
    cols: [],
    sortCol: null,
    reverse: false,
    autosort: true,

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
        if ($scope.autosort){
          $scope.sortCol = $scope.sortCol || $scope.cols[0];
        }

        //init repeater
        tr.attr('ng-repeat', ' it in items | orderBy:sortCol.index:reverse ');

        $scope.cols.forEach(function(col){
          trHtml += '<td>' + col.template() + '</td>';
        });

        $compile(tr.html(trHtml))($scope);
      });
    }
  });
};