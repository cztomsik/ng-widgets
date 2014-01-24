(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var
  angular = require('angular'),
  ngWidgets = angular.module('ngWidgets', [])
;

module.exports = ngWidgets;

angular.element.prototype.find = require('./src/qsa.js');

ngWidgets
  .value('ngWidget', require('./src/ngWidget.js'))

  .directive('content', require('./src/content'))
  .directive('nwList', require('./src/nw-list'))
  .directive('nwField', require('./src/nw-field'))
  .directive('nwRow', require('./src/nw-row'))
  .directive('nwPanel', require('./src/nw-panel'))
  .directive('nwModal', require('./src/nw-modal'))

  .directive('nwGrid', require('./src/nw-grid'))
//  .directive('nwGridCol', require('./src/nw-grid-col'))

  .directive('nwTabs', require('./src/nw-tabs'))
//  .directive('nwTab', require('./src/nw-tab'))
;
},{"./src/content":3,"./src/ngWidget.js":4,"./src/nw-field":5,"./src/nw-grid":6,"./src/nw-list":7,"./src/nw-modal":8,"./src/nw-panel":9,"./src/nw-row":10,"./src/nw-tabs":11,"./src/qsa.js":12,"angular":2}],2:[function(require,module,exports){
module.exports = window.angular;
},{}],3:[function(require,module,exports){
'use strict';

module.exports = function(){
  return {
    restrict: 'E',
    link: function($scope, $element, $attrs, ctrls, $transclude){
      $transclude($scope.$parent, $element.append.bind($element));
    }
  };
};
},{}],4:[function(require,module,exports){
'use strict';

var
  angular = require('angular')
;

module.exports = function(widgetDef){
  return angular.extend({}, {
    //defaults
    restrict: 'E',
    template: '',
    transclude: true,
    scope: {},

    //actual stuff
    compile: function(){
      return {
        pre: this.prelink.bind(this),
        post: this.link && this.link.bind(this)
      };
    },

    prelink: function($scope, $element, $attrs){
      for (var k in $attrs.$attr){
        $scope[k] = $attrs[k];
      }

      console.log($scope);
    }
  }, widgetDef);
};
},{"angular":2}],5:[function(require,module,exports){
'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template:
      '<div class="form-group" ng-class=" {\'has-error\': ngModel.$dirty && ngModel.$invalid} ">' +
      '  <label ng-show=" label " class="control-label">{{ label }}</label>' +
      '  <content></content>' +
      '</div>',

    link: function($scope, $element){
      var control = $element.find('textarea, select, input:not([type="radio"]):not([type="checkbox"])');

      $scope.ngModel = control.controller('ngModel');

      control.addClass('form-control');
    }
  });
};
},{}],6:[function(require,module,exports){
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
      '</table>'
  });
};
},{"angular":2}],7:[function(require,module,exports){
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

    scope: {
      emptyText: '@?'
    },

    controller: function($scope){
      $scope.emptyText = 'No items found';
    }
  });
};
},{}],8:[function(require,module,exports){
'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    style: 'nw-modal .modal{display: block}',

    //optional full-height styles
    //TODO: consider introducing new element
    //TODO: consider relation to overlay
    //
    // nw-modal .modal-content{border-radius: 0; border: 0; height: 100%}
    // nw-modal .modal-dialog{position: fixed; width: 100%; height: 100%; margin: 0; top: 0; left: 0}

    template:
      '<div class="modal" role="dialog"><div class="modal-dialog"><div class="modal-content">' +
      '  <div class="modal-header" ng-show=" name "><h3 class="modal-title">{{ name }}</h3></div>' +
      '  <div class="modal-body">' +
      '    <content></content>' +
      '  </div>' +
      '  <div class="modal-footer" ng-show=" footer ">{{ footer }}</div>' +
      '</div></div></div>'
  });
};
},{}],9:[function(require,module,exports){
'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template:
      '<div class="panel panel-default">' +
      '  <div class="panel-heading" ng-show=" name ">{{ name }}</div>' +
      '  <div class="panel-body">' +
      '    <content></content>' +
      '  </div>' +
      '</div>'
  });
};
},{}],10:[function(require,module,exports){
'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template: '<div class="row"><content></content></div>',
    link: function($scope, $element, $attrs){
      $element.find('.row > content').children().addClass($attrs.itemClass);
    }
  });
};
},{}],11:[function(require,module,exports){
'use strict';

var angular = require('angular');

module.exports = function(ngWidget){
  return ngWidget({
    style: 'nw-tabs nw-list{display: block; margin-bottom: 1em}',

    template:
      '<nw-list items=" tabs " list-class="nav nav-tabs" ng-model=" activeTab " autoselect></nw-list>' +
      '<content></content>'
  });
};
},{"angular":2}],12:[function(require,module,exports){
'use strict';

var angular = require('angular');

module.exports = function(selector){
  var res = [];

  [].forEach.call(this, function(el){
    res.push.apply(res, el.querySelectorAll(selector));
  });

  return angular.element(res);
};
},{"angular":2}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZ1dpZGdldHMvaW5kZXguanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9zaGltcy9hbmd1bGFyLmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZ1dpZGdldHMvc3JjL2NvbnRlbnQuanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9zcmMvbmdXaWRnZXQuanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9zcmMvbnctZmllbGQuanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9zcmMvbnctZ3JpZC5qcyIsIi9Vc2Vycy9jenRvbXNpay9EZXNrdG9wL3BsYXlncm91bmQvbmdXaWRnZXRzL3NyYy9udy1saXN0LmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZ1dpZGdldHMvc3JjL253LW1vZGFsLmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZ1dpZGdldHMvc3JjL253LXBhbmVsLmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZ1dpZGdldHMvc3JjL253LXJvdy5qcyIsIi9Vc2Vycy9jenRvbXNpay9EZXNrdG9wL3BsYXlncm91bmQvbmdXaWRnZXRzL3NyYy9udy10YWJzLmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZ1dpZGdldHMvc3JjL3FzYS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhclxuICBhbmd1bGFyID0gcmVxdWlyZSgnYW5ndWxhcicpLFxuICBuZ1dpZGdldHMgPSBhbmd1bGFyLm1vZHVsZSgnbmdXaWRnZXRzJywgW10pXG47XG5cbm1vZHVsZS5leHBvcnRzID0gbmdXaWRnZXRzO1xuXG5hbmd1bGFyLmVsZW1lbnQucHJvdG90eXBlLmZpbmQgPSByZXF1aXJlKCcuL3NyYy9xc2EuanMnKTtcblxubmdXaWRnZXRzXG4gIC52YWx1ZSgnbmdXaWRnZXQnLCByZXF1aXJlKCcuL3NyYy9uZ1dpZGdldC5qcycpKVxuXG4gIC5kaXJlY3RpdmUoJ2NvbnRlbnQnLCByZXF1aXJlKCcuL3NyYy9jb250ZW50JykpXG4gIC5kaXJlY3RpdmUoJ253TGlzdCcsIHJlcXVpcmUoJy4vc3JjL253LWxpc3QnKSlcbiAgLmRpcmVjdGl2ZSgnbndGaWVsZCcsIHJlcXVpcmUoJy4vc3JjL253LWZpZWxkJykpXG4gIC5kaXJlY3RpdmUoJ253Um93JywgcmVxdWlyZSgnLi9zcmMvbnctcm93JykpXG4gIC5kaXJlY3RpdmUoJ253UGFuZWwnLCByZXF1aXJlKCcuL3NyYy9udy1wYW5lbCcpKVxuICAuZGlyZWN0aXZlKCdud01vZGFsJywgcmVxdWlyZSgnLi9zcmMvbnctbW9kYWwnKSlcblxuICAuZGlyZWN0aXZlKCdud0dyaWQnLCByZXF1aXJlKCcuL3NyYy9udy1ncmlkJykpXG4vLyAgLmRpcmVjdGl2ZSgnbndHcmlkQ29sJywgcmVxdWlyZSgnLi9zcmMvbnctZ3JpZC1jb2wnKSlcblxuICAuZGlyZWN0aXZlKCdud1RhYnMnLCByZXF1aXJlKCcuL3NyYy9udy10YWJzJykpXG4vLyAgLmRpcmVjdGl2ZSgnbndUYWInLCByZXF1aXJlKCcuL3NyYy9udy10YWInKSlcbjsiLCJtb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy5hbmd1bGFyOyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpe1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgbGluazogZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCBjdHJscywgJHRyYW5zY2x1ZGUpe1xuICAgICAgJHRyYW5zY2x1ZGUoJHNjb3BlLiRwYXJlbnQsICRlbGVtZW50LmFwcGVuZC5iaW5kKCRlbGVtZW50KSk7XG4gICAgfVxuICB9O1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhclxuICBhbmd1bGFyID0gcmVxdWlyZSgnYW5ndWxhcicpXG47XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24od2lkZ2V0RGVmKXtcbiAgcmV0dXJuIGFuZ3VsYXIuZXh0ZW5kKHt9LCB7XG4gICAgLy9kZWZhdWx0c1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgdGVtcGxhdGU6ICcnLFxuICAgIHRyYW5zY2x1ZGU6IHRydWUsXG4gICAgc2NvcGU6IHt9LFxuXG4gICAgLy9hY3R1YWwgc3R1ZmZcbiAgICBjb21waWxlOiBmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcHJlOiB0aGlzLnByZWxpbmsuYmluZCh0aGlzKSxcbiAgICAgICAgcG9zdDogdGhpcy5saW5rICYmIHRoaXMubGluay5iaW5kKHRoaXMpXG4gICAgICB9O1xuICAgIH0sXG5cbiAgICBwcmVsaW5rOiBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMpe1xuICAgICAgZm9yICh2YXIgayBpbiAkYXR0cnMuJGF0dHIpe1xuICAgICAgICAkc2NvcGVba10gPSAkYXR0cnNba107XG4gICAgICB9XG5cbiAgICAgIGNvbnNvbGUubG9nKCRzY29wZSk7XG4gICAgfVxuICB9LCB3aWRnZXREZWYpO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmdXaWRnZXQpe1xuICByZXR1cm4gbmdXaWRnZXQoe1xuICAgIHRlbXBsYXRlOlxuICAgICAgJzxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCIgbmctY2xhc3M9XCIge1xcJ2hhcy1lcnJvclxcJzogbmdNb2RlbC4kZGlydHkgJiYgbmdNb2RlbC4kaW52YWxpZH0gXCI+JyArXG4gICAgICAnICA8bGFiZWwgbmctc2hvdz1cIiBsYWJlbCBcIiBjbGFzcz1cImNvbnRyb2wtbGFiZWxcIj57eyBsYWJlbCB9fTwvbGFiZWw+JyArXG4gICAgICAnICA8Y29udGVudD48L2NvbnRlbnQ+JyArXG4gICAgICAnPC9kaXY+JyxcblxuICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQpe1xuICAgICAgdmFyIGNvbnRyb2wgPSAkZWxlbWVudC5maW5kKCd0ZXh0YXJlYSwgc2VsZWN0LCBpbnB1dDpub3QoW3R5cGU9XCJyYWRpb1wiXSk6bm90KFt0eXBlPVwiY2hlY2tib3hcIl0pJyk7XG5cbiAgICAgICRzY29wZS5uZ01vZGVsID0gY29udHJvbC5jb250cm9sbGVyKCduZ01vZGVsJyk7XG5cbiAgICAgIGNvbnRyb2wuYWRkQ2xhc3MoJ2Zvcm0tY29udHJvbCcpO1xuICAgIH1cbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFuZ3VsYXIgPSByZXF1aXJlKCdhbmd1bGFyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmdXaWRnZXQpe1xuICByZXR1cm4gbmdXaWRnZXQoe1xuICAgIHN0eWxlOlxuICAgICAgLy9oYW5kICsgdW5zZWxlY3RhYmxlXG4gICAgICAnbnctZ3JpZCB0aGVhZCB0aHtjdXJzb3I6IHBvaW50ZXI7IC13ZWJraXQtdG91Y2gtY2FsbG91dDogbm9uZTsgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTsgLWtodG1sLXVzZXItc2VsZWN0OiBub25lOyAtbW96LXVzZXItc2VsZWN0OiBub25lOyAtbXMtdXNlci1zZWxlY3Q6IG5vbmU7IHVzZXItc2VsZWN0OiBub25lfScgK1xuICAgICAgJ253LWdyaWRbbmctbW9kZWxdIHRib2R5IHRye2N1cnNvcjogcG9pbnRlcn0nICtcblxuICAgICAgLy9jYXJyZXQgdmlzaWJpbGl0eVxuICAgICAgJ253LWdyaWQgdGggaS5mYXt2aXNpYmlsaXR5OiBoaWRkZW59JyArXG4gICAgICAnbnctZ3JpZCB0aC5hY3RpdmUgaS5mYXt2aXNpYmlsaXR5OiB2aXNpYmxlfScgK1xuXG4gICAgICAvL2Jvb3RzdHJhcCBidWc/IHN0cmlwZWQgKyBob3ZlciArIGFjdGl2ZVxuICAgICAgJ253LWdyaWQgdHIuYWN0aXZlIHRke2JhY2tncm91bmQ6ICM2OGMgIWltcG9ydGFudDsgY29sb3I6ICNmZmYgIWltcG9ydGFudH0nLFxuXG4gICAgdGVtcGxhdGU6XG4gICAgICAnPHRhYmxlIGNsYXNzPVwidGFibGUgdGFibGUtc3RyaXBlZCB0YWJsZS1ob3ZlciB0YWJsZS1ib3JkZXJlZFwiPicgK1xuICAgICAgJyAgPHRoZWFkPicgK1xuICAgICAgJyAgICA8dHI+JyArXG4gICAgICAnICAgIDx0aCcgK1xuICAgICAgJyAgICAgIG5nLXJlcGVhdD1cIiBjb2wgaW4gY29scyBcIiAnICtcbiAgICAgICcgICAgICBuZy1jbGFzcz1cIiB7YWN0aXZlOiBjb2wgPT0gc29ydENvbH0gXCIgJyArXG4gICAgICAnICAgICAgbmctY2xpY2s9XCIgJHBhcmVudC5yZXZlcnNlID0gKChjb2wgPT0gc29ydENvbCkgJiYgIXJldmVyc2UpOyAkcGFyZW50LnNvcnRDb2wgPSBjb2wgXCIgJyArXG4gICAgICAnICAgID4nICtcbiAgICAgICcgICAgICB7eyBjb2wubmFtZSB9fSAnICtcbiAgICAgICcgICAgICA8aSBjbGFzcz1cImZhIGZhLWNhcmV0LXt7IHJldmVyc2UgP1xcJ2Rvd25cXCcgOlxcJ3VwXFwnIH19IHB1bGwtcmlnaHRcIj48L2k+JyArXG4gICAgICAnICAgIDwvdGg+JyArXG4gICAgICAnICAgIDwvdHI+JyArXG4gICAgICAnICA8L3RoZWFkPicgK1xuICAgICAgJyAgPHRib2R5PicgK1xuICAgICAgJyAgICA8dHI+PHRkPlZhbHVlPC90ZD48L3RyPicgK1xuICAgICAgJyAgPC90Ym9keT4nICtcbiAgICAgICc8L3RhYmxlPidcbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuZ1dpZGdldCl7XG4gIHJldHVybiBuZ1dpZGdldCh7XG4gICAgdGVtcGxhdGU6XG4gICAgICAnPHVsIG5nLXNob3c9XCIgaXRlbXMgXCI+JyArXG4gICAgICAnICA8bGkgbmctcmVwZWF0PVwiIGl0IGluIGl0ZW1zIFwiPicgK1xuICAgICAgJyAgICB7eyBpdC5uYW1lIH19JyArXG4gICAgICAnICA8L2xpPicgK1xuICAgICAgJzwvdWw+JyArXG4gICAgICAnPHAgbmctaGlkZT1cIiBpdGVtcyBcIj57eyBlbXB0eVRleHQgfX08L3A+JyxcblxuICAgIHNjb3BlOiB7XG4gICAgICBlbXB0eVRleHQ6ICdAPydcbiAgICB9LFxuXG4gICAgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKXtcbiAgICAgICRzY29wZS5lbXB0eVRleHQgPSAnTm8gaXRlbXMgZm91bmQnO1xuICAgIH1cbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuZ1dpZGdldCl7XG4gIHJldHVybiBuZ1dpZGdldCh7XG4gICAgc3R5bGU6ICdudy1tb2RhbCAubW9kYWx7ZGlzcGxheTogYmxvY2t9JyxcblxuICAgIC8vb3B0aW9uYWwgZnVsbC1oZWlnaHQgc3R5bGVzXG4gICAgLy9UT0RPOiBjb25zaWRlciBpbnRyb2R1Y2luZyBuZXcgZWxlbWVudFxuICAgIC8vVE9ETzogY29uc2lkZXIgcmVsYXRpb24gdG8gb3ZlcmxheVxuICAgIC8vXG4gICAgLy8gbnctbW9kYWwgLm1vZGFsLWNvbnRlbnR7Ym9yZGVyLXJhZGl1czogMDsgYm9yZGVyOiAwOyBoZWlnaHQ6IDEwMCV9XG4gICAgLy8gbnctbW9kYWwgLm1vZGFsLWRpYWxvZ3twb3NpdGlvbjogZml4ZWQ7IHdpZHRoOiAxMDAlOyBoZWlnaHQ6IDEwMCU7IG1hcmdpbjogMDsgdG9wOiAwOyBsZWZ0OiAwfVxuXG4gICAgdGVtcGxhdGU6XG4gICAgICAnPGRpdiBjbGFzcz1cIm1vZGFsXCIgcm9sZT1cImRpYWxvZ1wiPjxkaXYgY2xhc3M9XCJtb2RhbC1kaWFsb2dcIj48ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPicgK1xuICAgICAgJyAgPGRpdiBjbGFzcz1cIm1vZGFsLWhlYWRlclwiIG5nLXNob3c9XCIgbmFtZSBcIj48aDMgY2xhc3M9XCJtb2RhbC10aXRsZVwiPnt7IG5hbWUgfX08L2gzPjwvZGl2PicgK1xuICAgICAgJyAgPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIj4nICtcbiAgICAgICcgICAgPGNvbnRlbnQ+PC9jb250ZW50PicgK1xuICAgICAgJyAgPC9kaXY+JyArXG4gICAgICAnICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCIgbmctc2hvdz1cIiBmb290ZXIgXCI+e3sgZm9vdGVyIH19PC9kaXY+JyArXG4gICAgICAnPC9kaXY+PC9kaXY+PC9kaXY+J1xuICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5nV2lkZ2V0KXtcbiAgcmV0dXJuIG5nV2lkZ2V0KHtcbiAgICB0ZW1wbGF0ZTpcbiAgICAgICc8ZGl2IGNsYXNzPVwicGFuZWwgcGFuZWwtZGVmYXVsdFwiPicgK1xuICAgICAgJyAgPGRpdiBjbGFzcz1cInBhbmVsLWhlYWRpbmdcIiBuZy1zaG93PVwiIG5hbWUgXCI+e3sgbmFtZSB9fTwvZGl2PicgK1xuICAgICAgJyAgPGRpdiBjbGFzcz1cInBhbmVsLWJvZHlcIj4nICtcbiAgICAgICcgICAgPGNvbnRlbnQ+PC9jb250ZW50PicgK1xuICAgICAgJyAgPC9kaXY+JyArXG4gICAgICAnPC9kaXY+J1xuICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5nV2lkZ2V0KXtcbiAgcmV0dXJuIG5nV2lkZ2V0KHtcbiAgICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJyb3dcIj48Y29udGVudD48L2NvbnRlbnQ+PC9kaXY+JyxcbiAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMpe1xuICAgICAgJGVsZW1lbnQuZmluZCgnLnJvdyA+IGNvbnRlbnQnKS5jaGlsZHJlbigpLmFkZENsYXNzKCRhdHRycy5pdGVtQ2xhc3MpO1xuICAgIH1cbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFuZ3VsYXIgPSByZXF1aXJlKCdhbmd1bGFyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmdXaWRnZXQpe1xuICByZXR1cm4gbmdXaWRnZXQoe1xuICAgIHN0eWxlOiAnbnctdGFicyBudy1saXN0e2Rpc3BsYXk6IGJsb2NrOyBtYXJnaW4tYm90dG9tOiAxZW19JyxcblxuICAgIHRlbXBsYXRlOlxuICAgICAgJzxudy1saXN0IGl0ZW1zPVwiIHRhYnMgXCIgbGlzdC1jbGFzcz1cIm5hdiBuYXYtdGFic1wiIG5nLW1vZGVsPVwiIGFjdGl2ZVRhYiBcIiBhdXRvc2VsZWN0PjwvbnctbGlzdD4nICtcbiAgICAgICc8Y29udGVudD48L2NvbnRlbnQ+J1xuICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYW5ndWxhciA9IHJlcXVpcmUoJ2FuZ3VsYXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzZWxlY3Rvcil7XG4gIHZhciByZXMgPSBbXTtcblxuICBbXS5mb3JFYWNoLmNhbGwodGhpcywgZnVuY3Rpb24oZWwpe1xuICAgIHJlcy5wdXNoLmFwcGx5KHJlcywgZWwucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpO1xuICB9KTtcblxuICByZXR1cm4gYW5ndWxhci5lbGVtZW50KHJlcyk7XG59OyJdfQ==
