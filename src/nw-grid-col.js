'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    name: '',
    index: '',
    type: 'static',

    init: function($scope, $element, $transclude){
      //copy contents (TODO: $host)
      var tmp = $element.clone().html('');
      $transclude(this, tmp.append.bind(tmp));

      this.html = tmp.find('template').html();

      this.$parent.cols.push(this);
    },

    template: function(){
      return this.html || ('{{ it["' + this.index + '"] }}');
    }
  });
};