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

        if ($attrs.$$observers && $attrs.$$observers[k]){
          $attrs.$observe(k, dotSet($scope, k));
        }
      }
    }
  }, widgetDef);
};

function dotSet(obj, prop){
  return function(val){
    obj[prop] = val;
  };
}
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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZ1dpZGdldHMvaW5kZXguanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9zaGltcy9hbmd1bGFyLmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZ1dpZGdldHMvc3JjL2NvbnRlbnQuanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9zcmMvbmdXaWRnZXQuanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9zcmMvbnctZmllbGQuanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9zcmMvbnctZ3JpZC5qcyIsIi9Vc2Vycy9jenRvbXNpay9EZXNrdG9wL3BsYXlncm91bmQvbmdXaWRnZXRzL3NyYy9udy1saXN0LmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZ1dpZGdldHMvc3JjL253LW1vZGFsLmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZ1dpZGdldHMvc3JjL253LXBhbmVsLmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZ1dpZGdldHMvc3JjL253LXJvdy5qcyIsIi9Vc2Vycy9jenRvbXNpay9EZXNrdG9wL3BsYXlncm91bmQvbmdXaWRnZXRzL3NyYy9udy10YWJzLmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZ1dpZGdldHMvc3JjL3FzYS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXJcbiAgYW5ndWxhciA9IHJlcXVpcmUoJ2FuZ3VsYXInKSxcbiAgbmdXaWRnZXRzID0gYW5ndWxhci5tb2R1bGUoJ25nV2lkZ2V0cycsIFtdKVxuO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5nV2lkZ2V0cztcblxuYW5ndWxhci5lbGVtZW50LnByb3RvdHlwZS5maW5kID0gcmVxdWlyZSgnLi9zcmMvcXNhLmpzJyk7XG5cbm5nV2lkZ2V0c1xuICAudmFsdWUoJ25nV2lkZ2V0JywgcmVxdWlyZSgnLi9zcmMvbmdXaWRnZXQuanMnKSlcblxuICAuZGlyZWN0aXZlKCdjb250ZW50JywgcmVxdWlyZSgnLi9zcmMvY29udGVudCcpKVxuICAuZGlyZWN0aXZlKCdud0xpc3QnLCByZXF1aXJlKCcuL3NyYy9udy1saXN0JykpXG4gIC5kaXJlY3RpdmUoJ253RmllbGQnLCByZXF1aXJlKCcuL3NyYy9udy1maWVsZCcpKVxuICAuZGlyZWN0aXZlKCdud1JvdycsIHJlcXVpcmUoJy4vc3JjL253LXJvdycpKVxuICAuZGlyZWN0aXZlKCdud1BhbmVsJywgcmVxdWlyZSgnLi9zcmMvbnctcGFuZWwnKSlcbiAgLmRpcmVjdGl2ZSgnbndNb2RhbCcsIHJlcXVpcmUoJy4vc3JjL253LW1vZGFsJykpXG5cbiAgLmRpcmVjdGl2ZSgnbndHcmlkJywgcmVxdWlyZSgnLi9zcmMvbnctZ3JpZCcpKVxuLy8gIC5kaXJlY3RpdmUoJ253R3JpZENvbCcsIHJlcXVpcmUoJy4vc3JjL253LWdyaWQtY29sJykpXG5cbiAgLmRpcmVjdGl2ZSgnbndUYWJzJywgcmVxdWlyZSgnLi9zcmMvbnctdGFicycpKVxuLy8gIC5kaXJlY3RpdmUoJ253VGFiJywgcmVxdWlyZSgnLi9zcmMvbnctdGFiJykpXG47IiwibW9kdWxlLmV4cG9ydHMgPSB3aW5kb3cuYW5ndWxhcjsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgY3RybHMsICR0cmFuc2NsdWRlKXtcbiAgICAgICR0cmFuc2NsdWRlKCRzY29wZS4kcGFyZW50LCAkZWxlbWVudC5hcHBlbmQuYmluZCgkZWxlbWVudCkpO1xuICAgIH1cbiAgfTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXJcbiAgYW5ndWxhciA9IHJlcXVpcmUoJ2FuZ3VsYXInKVxuO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHdpZGdldERlZil7XG4gIHJldHVybiBhbmd1bGFyLmV4dGVuZCh7fSwge1xuICAgIC8vZGVmYXVsdHNcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIHRlbXBsYXRlOiAnJyxcbiAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgIHNjb3BlOiB7fSxcblxuICAgIC8vYWN0dWFsIHN0dWZmXG4gICAgY29tcGlsZTogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHByZTogdGhpcy5wcmVsaW5rLmJpbmQodGhpcyksXG4gICAgICAgIHBvc3Q6IHRoaXMubGluayAmJiB0aGlzLmxpbmsuYmluZCh0aGlzKVxuICAgICAgfTtcbiAgICB9LFxuXG4gICAgcHJlbGluazogZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzKXtcbiAgICAgIGZvciAodmFyIGsgaW4gJGF0dHJzLiRhdHRyKXtcbiAgICAgICAgJHNjb3BlW2tdID0gJGF0dHJzW2tdO1xuXG4gICAgICAgIGlmICgkYXR0cnMuJCRvYnNlcnZlcnMgJiYgJGF0dHJzLiQkb2JzZXJ2ZXJzW2tdKXtcbiAgICAgICAgICAkYXR0cnMuJG9ic2VydmUoaywgZG90U2V0KCRzY29wZSwgaykpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LCB3aWRnZXREZWYpO1xufTtcblxuZnVuY3Rpb24gZG90U2V0KG9iaiwgcHJvcCl7XG4gIHJldHVybiBmdW5jdGlvbih2YWwpe1xuICAgIG9ialtwcm9wXSA9IHZhbDtcbiAgfTtcbn0iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmdXaWRnZXQpe1xuICByZXR1cm4gbmdXaWRnZXQoe1xuICAgIHRlbXBsYXRlOlxuICAgICAgJzxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCIgbmctY2xhc3M9XCIge1xcJ2hhcy1lcnJvclxcJzogbmdNb2RlbC4kZGlydHkgJiYgbmdNb2RlbC4kaW52YWxpZH0gXCI+JyArXG4gICAgICAnICA8bGFiZWwgbmctc2hvdz1cIiBsYWJlbCBcIiBjbGFzcz1cImNvbnRyb2wtbGFiZWxcIj57eyBsYWJlbCB9fTwvbGFiZWw+JyArXG4gICAgICAnICA8Y29udGVudD48L2NvbnRlbnQ+JyArXG4gICAgICAnPC9kaXY+JyxcblxuICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQpe1xuICAgICAgdmFyIGNvbnRyb2wgPSAkZWxlbWVudC5maW5kKCd0ZXh0YXJlYSwgc2VsZWN0LCBpbnB1dDpub3QoW3R5cGU9XCJyYWRpb1wiXSk6bm90KFt0eXBlPVwiY2hlY2tib3hcIl0pJyk7XG5cbiAgICAgICRzY29wZS5uZ01vZGVsID0gY29udHJvbC5jb250cm9sbGVyKCduZ01vZGVsJyk7XG5cbiAgICAgIGNvbnRyb2wuYWRkQ2xhc3MoJ2Zvcm0tY29udHJvbCcpO1xuICAgIH1cbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFuZ3VsYXIgPSByZXF1aXJlKCdhbmd1bGFyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmdXaWRnZXQpe1xuICByZXR1cm4gbmdXaWRnZXQoe1xuICAgIHN0eWxlOlxuICAgICAgLy9oYW5kICsgdW5zZWxlY3RhYmxlXG4gICAgICAnbnctZ3JpZCB0aGVhZCB0aHtjdXJzb3I6IHBvaW50ZXI7IC13ZWJraXQtdG91Y2gtY2FsbG91dDogbm9uZTsgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTsgLWtodG1sLXVzZXItc2VsZWN0OiBub25lOyAtbW96LXVzZXItc2VsZWN0OiBub25lOyAtbXMtdXNlci1zZWxlY3Q6IG5vbmU7IHVzZXItc2VsZWN0OiBub25lfScgK1xuICAgICAgJ253LWdyaWRbbmctbW9kZWxdIHRib2R5IHRye2N1cnNvcjogcG9pbnRlcn0nICtcblxuICAgICAgLy9jYXJyZXQgdmlzaWJpbGl0eVxuICAgICAgJ253LWdyaWQgdGggaS5mYXt2aXNpYmlsaXR5OiBoaWRkZW59JyArXG4gICAgICAnbnctZ3JpZCB0aC5hY3RpdmUgaS5mYXt2aXNpYmlsaXR5OiB2aXNpYmxlfScgK1xuXG4gICAgICAvL2Jvb3RzdHJhcCBidWc/IHN0cmlwZWQgKyBob3ZlciArIGFjdGl2ZVxuICAgICAgJ253LWdyaWQgdHIuYWN0aXZlIHRke2JhY2tncm91bmQ6ICM2OGMgIWltcG9ydGFudDsgY29sb3I6ICNmZmYgIWltcG9ydGFudH0nLFxuXG4gICAgdGVtcGxhdGU6XG4gICAgICAnPHRhYmxlIGNsYXNzPVwidGFibGUgdGFibGUtc3RyaXBlZCB0YWJsZS1ob3ZlciB0YWJsZS1ib3JkZXJlZFwiPicgK1xuICAgICAgJyAgPHRoZWFkPicgK1xuICAgICAgJyAgICA8dHI+JyArXG4gICAgICAnICAgIDx0aCcgK1xuICAgICAgJyAgICAgIG5nLXJlcGVhdD1cIiBjb2wgaW4gY29scyBcIiAnICtcbiAgICAgICcgICAgICBuZy1jbGFzcz1cIiB7YWN0aXZlOiBjb2wgPT0gc29ydENvbH0gXCIgJyArXG4gICAgICAnICAgICAgbmctY2xpY2s9XCIgJHBhcmVudC5yZXZlcnNlID0gKChjb2wgPT0gc29ydENvbCkgJiYgIXJldmVyc2UpOyAkcGFyZW50LnNvcnRDb2wgPSBjb2wgXCIgJyArXG4gICAgICAnICAgID4nICtcbiAgICAgICcgICAgICB7eyBjb2wubmFtZSB9fSAnICtcbiAgICAgICcgICAgICA8aSBjbGFzcz1cImZhIGZhLWNhcmV0LXt7IHJldmVyc2UgP1xcJ2Rvd25cXCcgOlxcJ3VwXFwnIH19IHB1bGwtcmlnaHRcIj48L2k+JyArXG4gICAgICAnICAgIDwvdGg+JyArXG4gICAgICAnICAgIDwvdHI+JyArXG4gICAgICAnICA8L3RoZWFkPicgK1xuICAgICAgJyAgPHRib2R5PicgK1xuICAgICAgJyAgICA8dHI+PHRkPlZhbHVlPC90ZD48L3RyPicgK1xuICAgICAgJyAgPC90Ym9keT4nICtcbiAgICAgICc8L3RhYmxlPidcbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuZ1dpZGdldCl7XG4gIHJldHVybiBuZ1dpZGdldCh7XG4gICAgdGVtcGxhdGU6XG4gICAgICAnPHVsIG5nLXNob3c9XCIgaXRlbXNDb2xsIFwiIGNsYXNzPVwie3sgbGlzdENsYXNzIH19XCI+JyArXG4gICAgICAnICA8bGkgbmctcmVwZWF0PVwiIGl0IGluIGl0ZW1zQ29sbCBcIj4nICtcbiAgICAgICcgICAge3sgaXQubmFtZSB9fScgK1xuICAgICAgJyAgPC9saT4nICtcbiAgICAgICc8L3VsPicgK1xuICAgICAgJzxwIG5nLWhpZGU9XCIgaXRlbXNDb2xsIFwiPnt7IGVtcHR5VGV4dCB9fTwvcD4nLFxuXG4gICAgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKXtcbiAgICAgICRzY29wZS5lbXB0eVRleHQgPSAnTm8gaXRlbXMgZm91bmQnO1xuICAgIH0sXG5cbiAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUpe1xuICAgICAgJHNjb3BlLiRwYXJlbnQuJHdhdGNoQ29sbGVjdGlvbigkc2NvcGUuaXRlbXMsIGZ1bmN0aW9uKGl0ZW1zQ29sbCl7XG4gICAgICAgICRzY29wZS5pdGVtc0NvbGwgPSBpdGVtc0NvbGwgfHwgW107XG4gICAgICB9KTtcblxuICAgICAgLy9pZiAoJ2F1dG9zZWxlY3QnIGluICRzY29wZSl7XG4gICAgICAvL1xuICAgICAgLy99XG4gICAgfVxuICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5nV2lkZ2V0KXtcbiAgcmV0dXJuIG5nV2lkZ2V0KHtcbiAgICBzdHlsZTogJ253LW1vZGFsIC5tb2RhbHtkaXNwbGF5OiBibG9ja30nLFxuXG4gICAgLy9vcHRpb25hbCBmdWxsLWhlaWdodCBzdHlsZXNcbiAgICAvL1RPRE86IGNvbnNpZGVyIGludHJvZHVjaW5nIG5ldyBlbGVtZW50XG4gICAgLy9UT0RPOiBjb25zaWRlciByZWxhdGlvbiB0byBvdmVybGF5XG4gICAgLy9cbiAgICAvLyBudy1tb2RhbCAubW9kYWwtY29udGVudHtib3JkZXItcmFkaXVzOiAwOyBib3JkZXI6IDA7IGhlaWdodDogMTAwJX1cbiAgICAvLyBudy1tb2RhbCAubW9kYWwtZGlhbG9ne3Bvc2l0aW9uOiBmaXhlZDsgd2lkdGg6IDEwMCU7IGhlaWdodDogMTAwJTsgbWFyZ2luOiAwOyB0b3A6IDA7IGxlZnQ6IDB9XG5cbiAgICB0ZW1wbGF0ZTpcbiAgICAgICc8ZGl2IGNsYXNzPVwibW9kYWxcIiByb2xlPVwiZGlhbG9nXCI+PGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZ1wiPjxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+JyArXG4gICAgICAnICA8ZGl2IGNsYXNzPVwibW9kYWwtaGVhZGVyXCIgbmctc2hvdz1cIiBuYW1lIFwiPjxoMyBjbGFzcz1cIm1vZGFsLXRpdGxlXCI+e3sgbmFtZSB9fTwvaDM+PC9kaXY+JyArXG4gICAgICAnICA8ZGl2IGNsYXNzPVwibW9kYWwtYm9keVwiPicgK1xuICAgICAgJyAgICA8Y29udGVudD48L2NvbnRlbnQ+JyArXG4gICAgICAnICA8L2Rpdj4nICtcbiAgICAgICcgIDxkaXYgY2xhc3M9XCJtb2RhbC1mb290ZXJcIiBuZy1zaG93PVwiIGZvb3RlciBcIj57eyBmb290ZXIgfX08L2Rpdj4nICtcbiAgICAgICc8L2Rpdj48L2Rpdj48L2Rpdj4nXG4gIH0pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmdXaWRnZXQpe1xuICByZXR1cm4gbmdXaWRnZXQoe1xuICAgIHRlbXBsYXRlOlxuICAgICAgJzxkaXYgY2xhc3M9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCI+JyArXG4gICAgICAnICA8ZGl2IGNsYXNzPVwicGFuZWwtaGVhZGluZ1wiIG5nLXNob3c9XCIgbmFtZSBcIj57eyBuYW1lIH19PC9kaXY+JyArXG4gICAgICAnICA8ZGl2IGNsYXNzPVwicGFuZWwtYm9keVwiPicgK1xuICAgICAgJyAgICA8Y29udGVudD48L2NvbnRlbnQ+JyArXG4gICAgICAnICA8L2Rpdj4nICtcbiAgICAgICc8L2Rpdj4nXG4gIH0pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmdXaWRnZXQpe1xuICByZXR1cm4gbmdXaWRnZXQoe1xuICAgIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cInJvd1wiPjxjb250ZW50PjwvY29udGVudD48L2Rpdj4nLFxuICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycyl7XG4gICAgICAkZWxlbWVudC5maW5kKCcucm93ID4gY29udGVudCcpLmNoaWxkcmVuKCkuYWRkQ2xhc3MoJGF0dHJzLml0ZW1DbGFzcyk7XG4gICAgfVxuICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYW5ndWxhciA9IHJlcXVpcmUoJ2FuZ3VsYXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuZ1dpZGdldCl7XG4gIHJldHVybiBuZ1dpZGdldCh7XG4gICAgc3R5bGU6ICdudy10YWJzIG53LWxpc3R7ZGlzcGxheTogYmxvY2s7IG1hcmdpbi1ib3R0b206IDFlbX0nLFxuXG4gICAgdGVtcGxhdGU6XG4gICAgICAnPG53LWxpc3QgaXRlbXM9XCIgdGFicyBcIiBsaXN0LWNsYXNzPVwibmF2IG5hdi10YWJzXCIgbmctbW9kZWw9XCIgYWN0aXZlVGFiIFwiIGF1dG9zZWxlY3Q+PC9udy1saXN0PicgK1xuICAgICAgJzxjb250ZW50PjwvY29udGVudD4nXG4gIH0pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBhbmd1bGFyID0gcmVxdWlyZSgnYW5ndWxhcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHNlbGVjdG9yKXtcbiAgdmFyIHJlcyA9IFtdO1xuXG4gIFtdLmZvckVhY2guY2FsbCh0aGlzLCBmdW5jdGlvbihlbCl7XG4gICAgcmVzLnB1c2guYXBwbHkocmVzLCBlbC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSk7XG4gIH0pO1xuXG4gIHJldHVybiBhbmd1bGFyLmVsZW1lbnQocmVzKTtcbn07Il19
