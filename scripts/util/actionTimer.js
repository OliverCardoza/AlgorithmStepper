// Collaborator: Tim Down
// Original Source: http://stackoverflow.com/questions/3969475/javascript-pause-settimeout
define(['util/actionHelper', 'util/constants'],
function(actionHelper,        constants){
  return function ActionTimer(action, step){
    var timerId;
    var start;
    var remaining = step*constants.stepInterval;
    var action = action;
    var state;

    this.execute = function(){
      if(action.type === 'primarySelect'){
        actionHelper.select('#circle-'+action.value);
      } else if(action.type === 'secondarySelect') {
        actionHelper.select('#circle-'+action.value, null, true);
      } else if(action.type === 'swap'){
        actionHelper.swap('#circle-'+action.value[0], '#circle-'+action.value[1]);
      } else if(action.type === 'deselect'){
        actionHelper.deselect('#circle-'+action.value);
      } else if(action.type === 'end'){
        // clear action timers
        action.value.clearTimers();
      }
      action.type = 'finished';
    }

    this.pause = function() {
      if(state === 'run'){
        window.clearTimeout(timerId);
        remaining -= new Date() - start;
        state = 'pause';
      }
    };

    this.resume = function() {
      if(!state || state === 'pause'){
        start = new Date();
        timerId = window.setTimeout(this.execute, remaining);
        state = 'run';
      }
    };

    this.stop = function() {
      if(state === 'pause' || state === 'run'){
        window.clearTimeout(timerId);
        state = 'stop';
      }
    }

    this.resume();
  }
});