define(['lib/underscore', 'util/StepTimer', 'svgController'],
function(_,                StepTimer,        svgController){
  return function StepController(data, actions){
    var stepTimers = [];
    var self = this;

    this.play = function(){
      if(stepTimers.length){
        _.each(stepTimers, function(timer){
          timer.resume();
        });
        return;
      }

      svgController.clear();
      svgController.init(data);

      // refactor after looking up underscore methods
      var steps = [];
      _.each(actions, function(action){
        if(!steps[action.step]){
          steps[action.step] = [];
        }
        steps[action.step].push(action);
      });

      _.each(steps, function(actions, step){
        stepTimers.push(new StepTimer(actions, step));
      });
    };
    
    this.pause = function(){
      _.each(stepTimers, function(timer){
        timer.pause();
      });
    };

    this.stop = function(){
      _.each(stepTimers, function(timer){
        timer.stop();
      });
      self.clearTimers();
    };

    this.clearTimers = function(){
      stepTimers = [];
    };

    actions.push(svgController.createAction(actions[actions.length-1].step, 'end', {clearTimers: self.clearTimers}));
  };
});