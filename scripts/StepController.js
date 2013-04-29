define(['lib/d3', 'lib/underscore', 'util/tools', 'util/ActionTimer', 'util/actionHelper', 'algorithms/bubblesort'],
function(d3,       _,                tools,         ActionTimer,        actionHelper,        bubblesort){
  return function StepController(algorithm){
    var actions;
    var actionTimers = [];
    var data = [20, 60, 10, 50, 90, 30]; // TODO: replace with generator
    var svg = d3.select('svg');
    var self = this;

    var scalingFactor = (svg.attr('width')-100)/data.length;
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
      var actionQueue = tools.deepCopy(actions);
      svg.selectAll('circle').remove(); // TODO: lookup D3 way to chain these two commands without repeating the attr's
      svg.selectAll("circle")
          .data(data)
        .enter().append("circle")
          .attr("cy", svg.attr('height')/2)
          .attr("cx", function(val, i){
            return scalingFactor*i+50;
          })
          .attr("r", function(val){
            return val*0.5;
          })
          .attr("id", function(val){
            return "circle-" + val;
          });

      var step = 0;
      while(actionQueue.length){
        var continu = true;
        while(continu){
          // TODO: move this into ActionTimer.prototype
          (function a(){
            var action = actionQueue.splice(0, 1)[0];
            continu = action.continues;
            actionTimers.push(new ActionTimer(action, step));
          })();
        }
        step++;
      }
      actionTimers[actionTimers.length-1].continues = true;
      actionTimers.push(new ActionTimer(actionHelper.createAction('end', {clearTimers: self.clearTimers}), step));
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