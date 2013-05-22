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

    function basicAttr(selection){
      selection
        .attr('x', function(val, i){
          return horizontalPadding/2 + horizontalSpacing/2 + i*elementAndSpaceWidth;
        })
        .attr('width', elementWidth)
        .attr('y', function(val){
          return svg.attr('height')*(2/3) - val*verticalScalingFactor;
        })
        .attr('height', function(val){
          return val*verticalScalingFactor;
        })
        .attr("id", function(val){
          return 'd'+val;
        })
        .style('fill', constants.colors.default);
    }

    // Assumes numbers are in range [1, max]
    // Consider maybe changing to have flat bottom like bar-graph
    var rect = svg.selectAll("rect")
        .data(data);

    basicAttr(rect);
    basicAttr(rect.enter().append("rect"));
    rect.exit().remove();
  }

  function setColor(params){
    svg.select('#d'+params.datum).transition()
      .style('fill', params.color)
      .duration(constants.transitionDuration);
  }

  function setColorAndShift(params){
    var element = svg.select('#d'+params.datum);
    var x = Number(element.attr('x'));
    var y = Number(element.attr('y'));

    element.transition()
      .attr('x', x+xUnit*params.xUnits)
      .attr('y', y+yUnit*params.yUnits)
      .style('fill', params.color)
      .duration(constants.transitionDuration);
  }

  function shift(params){
    var element = svg.select('#d'+params.datum);
    var x = Number(element.attr('x'));
    var y = Number(element.attr('y'));

    element.transition()
      .attr('x', x+xUnit*params.xUnits)
      .attr('y', y+yUnit*params.yUnits)
      .duration(constants.transitionDuration);
  }

  function swapColorAndHorizontalPosition(params){
    var e1 = svg.select('#d'+params[0]);
    var e2 = svg.select('#d'+params[1]);

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

  function swapHorizontalPosition(params){
    var e1 = svg.select('#d'+params[0]);
    var e2 = svg.select('#d'+params[1]);

    e1.transition()
      .attr('x', e2.attr('x'))
      .duration(constants.transitionDuration);
    e2.transition()
      .attr('x', e1.attr('x'))
      .duration(constants.transitionDuration);
  }

  function select(params){
    var element = svg.select('#d'+params.datum);
    var cursor = svg.selectAll('rect#' + params.type)
      .data([params.type]);

    function setup(selection){
      selection
        .attr('x', element.attr('x'))
        .attr('width', element.attr('width'))
        .attr('y', function(){
          return Number(element.attr('y'))+Number(element.attr('height'))+10;
        })
        .attr('height', 15)
        .attr('id', params.type)
        .style('fill', constants.colors[params.type])
        .style('opacity', 0.5);
    }

    // TODO: commented line shouldn't cause problems...why does it at high speeds?
    // setup(cursor.transition().duration(constants.transitionDuration));
    setup(cursor.transition());
    setup(cursor.enter().append('rect'));
  }

  function deselect(params){
    svg.select('rect#'+params.type).remove();
  }

  var actionMap = {
    deselect: deselect,
    select: select,
    setColor: setColor,
    setColorAndShift: setColorAndShift,
    shift: shift,
    swapColorAndHorizontalPosition: swapColorAndHorizontalPosition,
    swapHorizontalPosition: swapHorizontalPosition
  };
  function execute(actions){
    _.each(actions, function(action){
      if(_.has(actionMap, action.type)){
        actionMap[action.type](action.params);
      } else {
        throw new Error('Unknown svg action');
      }
    });
  }

  function createAction(type, params){
    return { type: type, params: params };
  }

  return {
    init: init,
    execute: execute,
    createAction: createAction
  };
});