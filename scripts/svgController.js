define(['lib/d3', 'lib/underscore', 'util/constants'],
function(d3,       _,                constants){
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
          return 'd'+val;
        });
  }

  function setColor(element, color){
    element.transition().duration(constants.transitionDuration).style('fill', color);
  }

  function swapColorAndPosition(e1, e2){
    var x1 = e1.attr('cx');
    var x2 = e2.attr('cx');
    var y1 = e1.attr('cy');
    var y2 = e2.attr('cy');
    var c1 = e1.style('fill');
    var c2 = e2.style('fill');

    e1.transition()
      .attr('cx', x2)
      .attr('cy', y2)
      .style('fill', c2)
      .duration(constants.transitionDuration);
    e2.transition()
      .attr('cx', x1)
      .attr('cy', y1)
      .style('fill', c1)
      .duration(constants.transitionDuration);
  }

  function execute(actions){
    _.each(actions, function(action){
      if(action.type === 'setColor'){
        setColor(d3.select('#d'+action.params.datum), action.params.color);
      } else if(action.type === 'swapColorAndPosition'){
        swapColorAndPosition(d3.select('#d'+action.params[0]), d3.select('#d'+action.params[1]));
      } else if(action.type === 'end'){
        // clear action timers
        action.params.clearTimers();
      }
    });
  }

  function createAction(step, type, params){
    return { step: step, type: type, params: params };
  }

  return {
    clear: clear,
    init: init,
    execute: execute,
    createAction: createAction
  };
});