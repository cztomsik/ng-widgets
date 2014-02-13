'use strict';

module.exports = {
  pull: function(arr, item){
    var idx = arr.indexOf(item);

    return (~idx) && arr.splice(idx, 1);
  }
};