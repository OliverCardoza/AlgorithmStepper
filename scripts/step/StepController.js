define(['lib/underscore', 'step/StepTimer', 'svgController'],
function(_,                StepTimer,        svgController){
  return function StepController(data, steps){
    var stepTimers = [];
    var currentStep;
    var self = this;
    var state;

    function nextStep(){
      currentStep++;
      if(stepTimers[currentStep]){
        stepTimers[currentStep].start();
      } else {
        state = 'done';
      }
    };

    _.each(steps, function(actions, step){
      stepTimers.push(new StepTimer(actions, nextStep));
    });

    this.play = function(){
      // if in stable idle state
      if(!state || state === 'stop' || state === 'done'){
        svgController.init(data);

        currentStep = 0;
        state = 'run';
        stepTimers[currentStep].start();
      } else if(state === 'pause'){
        state = 'run';
        stepTimers[currentStep].resume();
      }
    };

    this.pause = function(){
      if(state === 'run'){
        state = 'pause';
        stepTimers[currentStep].pause();
      }
    };

    this.stop = function(){
      if(state === 'run' || state === 'pause'){
        state = 'stop';
        stepTimers[currentStep].stop();
      }
    };

    // Event handler for when the speed dial is changed
    this.changeSpeed = function(){
      if(state === 'run' || state === 'pause'){
        // resume will recalculate timeout values based on the new value of constants.stepInterval
        this.pause();
        this.play();
      }
    }
  };
});