// TODO: Change structure to only have 1 active timeout live at a time
define(['lib/underscore', 'step/StepTimer', 'svgController'],
function(_,                StepTimer,        svgController){
  return function StepController(data, steps){
    var stepTimers = [];
    var self = this;
    var state;

    this.play = function(){
      if(state === 'pause'){
        _.each(stepTimers, function(timer){
          timer.resume();
        });
        state = 'run';
      } else if(!state || state === 'stop' || state === 'done'){
        svgController.init(data);

        _.each(steps, function(actions, step){
          stepTimers.push(new StepTimer(actions, step));
        });
        state = 'run';
      }
    };
    
    this.pause = function(){
      if(state === 'run'){
        _.each(stepTimers, function(timer){
          timer.pause();
        });
        state = 'pause';
      }
    };

    this.stop = function(){
      if(state === 'run' || state === 'pause'){
        _.each(stepTimers, function(timer){
          timer.stop();
        });
        self.clearTimers();
        state = 'stop';
      }
    };

    this.done = function(){
      if(state === 'run'){
        self.clearTimers();
        state = 'done';
      }
    }

    this.clearTimers = function(){
      stepTimers = [];
    };

    // Event handler for when the speed dial is changed
    this.changeSpeed = function(){
      if(state === 'run' || state === 'pause'){
        // resume will recalculate timeout values based on the new value of constants.stepInterval
        this.pause();
        this.play();
      }
    }

    // Add finishing action to last step which clears timers
    steps[steps.length-1].push(svgController.createAction('end', {done: self.done}));
  };
});