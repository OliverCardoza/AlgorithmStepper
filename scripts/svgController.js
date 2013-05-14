define(['lib/d3', 'lib/underscore', 'util/constants'],
function(d3,       _,                constants){
  var svg = d3.select('svg');
  // var scalingFactor;
  var xUnit;
  var yUnit;

  function clear(){
    svg.selectAll('circle').remove();
  }

  function init(data){
    var max = _.max(data);

    // TODO: add sanity checks for these numbers (eg. elementAndSpaceWidth > 10)
    var verticalPadding = 30;
    var maxElementHeight = (svg.attr('height')-verticalPadding)/3; // Allow for each element to have at minimum 100% padding above and below
    var verticalMiddle = svg.attr('height')/2;
    var verticalScalingFactor = (maxElementHeight/2)/(max-1);

    var horizontalPadding = 30;
    var elementAndSpaceWidth = ((svg.attr('width')-horizontalPadding)/data.length); // Allow for each element and a half-element space betweeen to fit
    var elementWidth = elementAndSpaceWidth-10;
    var horizontalSpacing = 10;

    // TODO: calculate
    var cornerHeight = verticalScalingFactor*(elementWidth/elementAndSpaceWidth);
    
    // TODO: define better coordinate system for shifts
    scalingFactor = (svg.attr('width')-100)/data.length; // TODO: magic number
    yUnit = 100;
    xUnit = scalingFactor;

    // Assumes numbers are in range [1, max]
    svg.selectAll("polygon")
        .data(data)
      .enter().append("polygon")
        .attr("points", function(val, i){
          //    p3
          // p2
          // p1
          //    p4

          // TODO: change to object constructor with map using val as key
          // http://stackoverflow.com/questions/13204562/proper-format-for-drawing-polygon-data-in-d3
          var p1y = verticalMiddle + (val-1)*verticalScalingFactor;
          var p2y = verticalMiddle - (val-1)*verticalScalingFactor;
          var p3y = p2y - cornerHeight;
          var p4y = p1y + cornerHeight;

          var p1x = horizontalPadding/2 + horizontalSpacing/2 + i*elementAndSpaceWidth;
          var p2x = p1x;
          var p3x = p1x + elementWidth;
          var p4x = p3x;
          return p1x + "," + p1y + " "
               + p2x + "," + p2y + " "
               + p3x + "," + p3y + " "
               + p3x + "," + p4y;

        })
        .attr("id", function(val){
          return 'd'+val;
        });
  }

  function setColor(element, color){
    element.transition().duration(constants.transitionDuration).style('fill', color);
  }

  // TODO: fix all shifts
  function setColorAndShift(element, color, xUnits, yUnits){
    var x = Number(element.attr('cx'));
    var y = Number(element.attr('cy'));
    element.transition()
      .attr('cx', x+xUnits*xUnit)
      .attr('cy', y+yUnits*yUnit)
      .style('fill', color)
      .duration(constants.transitionDuration);
  }

  function shift(element, xUnits, yUnits){
    var x = Number(element.attr('cx'));
    var y = Number(element.attr('cy'));
    element.transition()
      .attr('cx', x+xUnits*xUnit)
      .attr('cy', y+yUnits*yUnit)
      .duration(constants.transitionDuration);
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

  function swapPosition(e1, e2){
    var x1 = e1.attr('cx');
    var x2 = e2.attr('cx');
    var y1 = e1.attr('cy');
    var y2 = e2.attr('cy');

    e1.transition()
      .attr('cx', x2)
      .attr('cy', y2)
      .duration(constants.transitionDuration);
    e2.transition()
      .attr('cx', x1)
      .attr('cy', y1)
      .duration(constants.transitionDuration);
  }

  function execute(actions){
    _.each(actions, function(action){
      if(action.type === 'setColor'){
        setColor(d3.select('#d'+action.params.datum), action.params.color);
      } else if(action.type === 'swapColorAndPosition'){
        swapColorAndPosition(d3.select('#d'+action.params[0]), d3.select('#d'+action.params[1]));
      } else if(action.type === 'swapPosition'){
        swapPosition(d3.select('#d'+action.params[0]), d3.select('#d'+action.params[1]));
      } else if(action.type === 'end'){
        // clear action timers
        action.params.done();
      } else if(action.type === 'setColorAndShift'){
        setColorAndShift(d3.select('#d'+action.params.datum), action.params.color, action.params.xUnits, action.params.yUnits);
      } else if(action.type === 'shift'){
        shift(d3.select('#d'+action.params.datum), action.params.xUnits, action.params.yUnits);
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