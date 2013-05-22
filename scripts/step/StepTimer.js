define(['util/constants', 'svgController'],
function(constants,        svgController){
  return function StepTimer(actions, callback){
    var timerId;
    var start;
    var remaining = constants.stepInterval;
    var state;
    var previousStepInterval = constants.stepInterval;

    this.execute = function(){
      svgController.execute(actions);
      state = 'done'
      callback();
    };

    this.pause = function() {
      if(state === 'run'){
        window.clearTimeout(timerId);
        remaining -= new Date() - start;
        state = 'pause';
      }
    };

    // Starting or resuming the timer is the same
    this.start = this.resume = function() {
      if(!state || state !== 'run'){
        start = new Date();
        // recalculate remaining based on current value of stepInterval
        remaining = (remaining % previousStepInterval) + Math.floor(remaining/previousStepInterval)*constants.stepInterval;
        previousStepInterval = constants.stepInterval;
        timerId = window.setTimeout(this.execute, remaining);
        state = 'run';
      }
    };

    this.stop = function() {
      if(state === 'pause' || state === 'run'){
        remaining = constants.stepInterval;
        previousStepInterval = constants.stepInterval;

        window.clearTimeout(timerId);
        state = 'stop';
      }
    };
  };
});