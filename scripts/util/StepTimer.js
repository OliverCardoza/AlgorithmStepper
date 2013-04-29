// Collaborator: Tim Down
// Original Source: http://stackoverflow.com/questions/3969475/javascript-pause-settimeout
define(['util/constants', 'svgController'],
function(constants,        svgController){
  return function StepTimer(actions, step){
    var timerId;
    var start;
    var remaining = step*constants.stepInterval;
    var actions = actions;
    var state;

    this.execute = function(){
      svgController.execute(actions);
      state = 'done'
    };

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
    };

    this.resume();
  };
});