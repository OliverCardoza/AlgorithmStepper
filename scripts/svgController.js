define(['lib/d3', 'util/actionHelper'],
function(d3,       actionHelper){
  var svg = d3.select('svg');
  var scalingFactor;

  function clear(){
    svg.selectAll('circle').remove();
  }

  function init(data){
    scalingFactor = (svg.attr('width')-100)/data.length;

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
  }

  function execute(action){
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

  return {
    clear: clear,
    init: init,
    execute: execute
  };
});