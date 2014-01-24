'use strict';

//<nw-row col-md-6>...</nw-row>
//repeat on all items
module.exports = function(ngWidget){
  return ngWidget({
    template: '<div class="row"><content></content></div>'
  });
};