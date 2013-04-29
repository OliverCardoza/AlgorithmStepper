define(['lib/underscore', 'util/tools', 'util/ActionTimer', 'algorithms/bubblesort', 'svgController'],
function(_,                tools,        ActionTimer,        bubblesort,              svgController){
  return function StepController(algorithm){
    var actions;
    var actionTimers = [];
    var data = [20, 60, 10, 50, 90, 30]; // TODO: replace with generator
    var self = this;

    switch(algorithm){
      case 'bubbleSort':
        actions = bubblesort.init({list: data}).sort();
        break;
      default:
        throw new Error('Bad algorithm name.');
    }

    this.play = function(){
      if(actionTimers.length){
        _.each(actionTimers, function(timer){
          timer.resume();
        });
        return;
      }

      svgController.clear();
      svgController.init(data);

      var actionQueue = tools.deepCopy(actions);
      var step = 0;
      while(actionQueue.length){
        var continues = true;
        while(continues){
          var action = actionQueue.splice(0, 1)[0];
          continues = action.continues;
          actionTimers.push(new ActionTimer(action, step));
        }
        step++;
      }
      // Add finishing action to last step which will clear the timers
      actionTimers[actionTimers.length-1].continues = true;
      actionTimers.push(new ActionTimer(svgController.createAction('end', {clearTimers: self.clearTimers}), step));
    };
    
    this.pause = function(){
      _.each(actionTimers, function(timer){
        timer.pause();
      });
    };

    this.stop = function(){
      _.each(actionTimers, function(timer){
        timer.stop();
      });
      self.clearTimers();
    };

    this.clearTimers = function(){
      actionTimers = [];
    };
  };
});