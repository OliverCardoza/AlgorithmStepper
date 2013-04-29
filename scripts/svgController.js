define(['lib/d3', 'util/constants'],
function(d3,       constants){
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
      select('#circle-'+action.value);
    } else if(action.type === 'secondarySelect') {
      select('#circle-'+action.value, null, true);
    } else if(action.type === 'swap'){
      swap('#circle-'+action.value[0], '#circle-'+action.value[1]);
    } else if(action.type === 'deselect'){
      deselect('#circle-'+action.value);
    } else if(action.type === 'end'){
      // clear action timers
      action.value.clearTimers();
    }
    action.type = 'finished';
  }

  // Begin Cut+Paste from actionHelper
  var primaryColor = 'red';
  var secondaryColor = 'blue';
  var defaultColor = 'black';

  var currentPrimary = null;
  var currentSecondary = null;

  function transitionColor(element, color){
    element.transition().duration(constants.transitionDuration).style('fill', color);
  }

  function select(id, keepPrevious, secondary){
    var deselectPrevious = !keepPrevious && ((!secondary && currentPrimary) || (secondary && currentSecondary));
    if(deselectPrevious){
      transitionColor(secondary?currentSecondary:currentPrimary, defaultColor);
    }
    if(secondary){
      currentSecondary = d3.select(id);
      transitionColor(currentSecondary, secondaryColor);
    } else {
      currentPrimary = d3.select(id);
      transitionColor(currentPrimary, primaryColor);
    }
  }

  function deselect(id){
    transitionColor(d3.select(id), defaultColor);
  }

  function swap(){
    var x1 = currentPrimary.attr('cx');
    var x2 = currentSecondary.attr('cx');
    currentPrimary.transition().attr('cx', x2).style('fill', secondaryColor).duration(constants.transitionDuration);
    currentSecondary.transition().attr('cx', x1).style('fill', primaryColor).duration(constants.transitionDuration);

    var tmp = currentSecondary;
    currentSecondary = currentPrimary;
    currentPrimary = tmp;
  }

  function createAction(type, value, continues){
    return { type: type, value: value, continues: !!continues};
  }
  // End Cut+Paste from actionHelper

  return {
    clear: clear,
    init: init,
    execute: execute,
    createAction: createAction
  };
});