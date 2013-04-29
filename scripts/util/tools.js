define(['lib/underscore'],
function(_){

  // Probably really bad. Underscore chose not to implement due to complexity. Look into 'Lodash'
  // Will work for an Array of Objects
  function deepCopy(val){
    var rVal;
      if(_.isObject(val)){
        if(_.isArray(val)){
          rVal = val.slice();
          _.each(rVal, function(val, i){
            rVal[i] = deepCopy(val);
          });
        } else {
          rVal = _.extend({},val);
        }
      } else {
        rVal = val;
      }
      return rVal;
  }

  return {
    deepCopy: deepCopy
  };
});