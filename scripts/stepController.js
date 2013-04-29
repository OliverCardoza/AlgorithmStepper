define(['lib/d3', 'lib/underscore', 'util/actionTimer', 'util/actionHelper', 'algorithms/bubblesort'],
function(d3,       _,                ActionTimer,        actionHelper,        bubblesort){
  return function StepController(algorithm){
    var actionTimers = [];
    var algorithm = algorithm;
    var data = [20, 60, 10, 50, 90, 30]; // TODO: replace with generator
    var svg = d3.select('svg');

    var scalingFactor = (svg.attr('width')-100)/data.length;

    this.play = function(){
      if(actionTimers.length){
        _.each(actionTimers, function(timer){
          timer.resume();
        });
        return;
      }

      var actions = bubblesort.init({list: data}).sort(); // TODO: separate algorithm selector

      svg.selectAll('circle').remove(); // TODO: conglomerate
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
      while(actions.length){
        var continu = true;
        while(continu){
          // TODO: move this into ActionTimer.prototype
          (function a(){
            var action = actions.splice(0, 1)[0];
            continu = action.continues;
            actionTimers.push(new ActionTimer(action, step));
          })();
        }
        step++;
      }
      actionTimers[actionTimers.length-1].continues = true;
      actionTimers.push(new ActionTimer(actionHelper.createAction('end', {clearTimers: this.clearTimers}), step));
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
      this.clearTimers();
    };

    this.clearTimers = function(){
      actionTimers = [];
    };
  };
});