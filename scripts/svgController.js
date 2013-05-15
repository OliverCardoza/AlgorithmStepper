define(['lib/d3', 'lib/underscore', 'util/constants'],
function(d3,       _,                constants){
  var svg = d3.select('svg');
  var xUnit;
  var yUnit;

  function init(data){
    var max = _.max(data);

    // TODO: minimum height for large data sets so that smallest element is visible
    // TODO: add sanity checks for these numbers (eg. elementAndSpaceWidth > 10)
    // TODO: replace scaling factors with d3.scale and d3.domain (when complete remove assumption about number domain)
    var verticalPadding = 30;
    var maxElementHeight = (svg.attr('height')-verticalPadding)/3; // Allow for each element to have at minimum 100% padding above and below
    var verticalMiddle = svg.attr('height')/2;
    var verticalScalingFactor = maxElementHeight/max;

    var horizontalPadding = 30;
    var elementAndSpaceWidth = ((svg.attr('width')-horizontalPadding)/data.length); // Allow for each element and a half-element space betweeen to fit
    var elementWidth = elementAndSpaceWidth-10;
    var horizontalSpacing = 10;
    
    // TODO: define better coordinate system for shifts
    yUnit = svg.attr('height')/3;
    xUnit = elementAndSpaceWidth;

    // Assumes numbers are in range [1, max]
    // Consider maybe changing to have flat bottom like bar-graph
    svg.selectAll("rect")
        .data(data)
      .enter().append("rect")
        .attr('x', function(val, i){
          return horizontalPadding/2 + horizontalSpacing/2 + i*elementAndSpaceWidth;
        })
        .attr('width', function(val){
          return elementWidth;
        })
        .attr('y', function(val){
          return svg.attr('height')*(2/3) - val*verticalScalingFactor;
        })
        .attr('height', function(val){
          return val*verticalScalingFactor;
        })
        .attr("id", function(val){
          return 'd'+val;
        });
      .exit().remove();
  }

  function setColor(element, color){
    element.transition().duration(constants.transitionDuration).style('fill', color);
  }

  function setColorAndShift(element, color, xUnits, yUnits){
    var x = Number(element.attr('x'));
    var y = Number(element.attr('y'));
    element.transition()
      .attr('x', x+xUnits*xUnit)
      .attr('y', y+yUnits*yUnit)
      .style('fill', color)
      .duration(constants.transitionDuration);
  }

  function shift(element, xUnits, yUnits){
    var x = Number(element.attr('x'));
    var y = Number(element.attr('y'));
    element.transition()
      .attr('x', x+xUnits*xUnit)
      .attr('y', y+yUnits*yUnit)
      .duration(constants.transitionDuration);
  }

  function swapColorAndHorizontalPosition(e1, e2){
    var x1 = e1.attr('x');
    var x2 = e2.attr('x');
    var c1 = e1.style('fill');
    var c2 = e2.style('fill');

    e1.transition()
      .attr('x', x2)
      .style('fill', c2)
      .duration(constants.transitionDuration);
    e2.transition()
      .attr('x', x1)
      .style('fill', c1)
      .duration(constants.transitionDuration);
  }

  function swapHorizontalPosition(e1, e2){
    var x1 = e1.attr('x');
    var x2 = e2.attr('x');

    e1.transition()
      .attr('x', x2)
      .duration(constants.transitionDuration);
    e2.transition()
      .attr('x', x1)
      .duration(constants.transitionDuration);
  }

  function execute(actions){
    _.each(actions, function(action){
      if(action.type === 'setColor'){
        setColor(d3.select('#d'+action.params.datum), action.params.color);
      } else if(action.type === 'swapColorAndHorizontalPosition'){
        swapColorAndHorizontalPosition(d3.select('#d'+action.params[0]), d3.select('#d'+action.params[1]));
      } else if(action.type === 'swapHorizontalPosition'){
        swapHorizontalPosition(d3.select('#d'+action.params[0]), d3.select('#d'+action.params[1]));
      } else if(action.type === 'end'){
        // clear action timers
        action.params.done();
      } else if(action.type === 'setColorAndShift'){
        setColorAndShift(d3.select('#d'+action.params.datum), action.params.color, action.params.xUnits, action.params.yUnits);
      } else if(action.type === 'shift'){
        shift(d3.select('#d'+action.params.datum), action.params.xUnits, action.params.yUnits);
      } else {
        throw new Error('Unknown svg action');
      }
    });
  }

  function createAction(step, type, params){
    return { step: step, type: type, params: params };
  }

  return {
    init: init,
    execute: execute,
    createAction: createAction
  };
});