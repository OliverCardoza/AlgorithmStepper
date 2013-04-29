requirejs(['./algorithms/bubblesort', './lib/d3', './lib/underscore', './util/actionHelper', './util/actionTimer'],
function(   bs,                        d3,         _,                  actionHelper,          ActionTimer) {
  var actionTimers = [];

  function play(){
    if(actionTimers.length){
      _.each(actionTimers, function(timer){
        timer.resume();
      });
      return;
    }

    // TODO: replace with generator
    var data = [20, 60, 10, 50, 90, 30];

    // TODO: separate algorithm selector
    bs.init({list: data});
    var actions = bs.sort();

    var svg = d3.select('svg');
    svg.selectAll('circle').remove();

    var scalingFactor = (svg.attr('width')-100)/data.length;
    svg.selectAll("circle")
        .data(data)
      .enter().append("circle")
        .attr("cy", 150)
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
        (function a(){
          var action = actions.splice(0, 1)[0];
          continu = action.continues;
          actionTimers.push(new ActionTimer(action, step));
        })();
      }
      step++;
    }
    actionTimers[actionTimers.length-1].continues = true;
    actionTimers.push(new ActionTimer(actionHelper.createAction('end', {clearTimers: clearTimers}), step))
  }

  function pause(){
    _.each(actionTimers, function(timer){
      timer.pause();
    });
  }

  function stop(){
    _.each(actionTimers, function(timer){
      timer.stop();
    });
    clearTimers();
  }

  function clearTimers(){
    actionTimers = [];
  }

  document.getElementById('play').addEventListener('click', play, false);
  document.getElementById('pause').addEventListener('click', pause, false);
  document.getElementById('stop').addEventListener('click', stop, false);
  play();
});