'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    name: '',
    index: '',

    init: function($scope, $element, $transclude){
      //copy contents (TODO: $host)
      var tmp = $element.clone().html('');
      $transclude(this, tmp.append.bind(tmp));

      this.template = tmp.find('template').html();

      this.$parent.cols.push(this);
    }
  });
};