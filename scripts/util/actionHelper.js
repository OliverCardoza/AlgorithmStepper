define(['lib/d3', 'util/constants'],
function(d3,       constants){
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

  return {
    select: select,
    createAction: createAction,
    swap: swap,
    deselect: deselect
  };
});