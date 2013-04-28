define(['lib/d3', 'util/constants'],
function(d3,       constants){
  var primaryColor = 'red';
  var secondaryColor = 'blue';
  var defaultColor = 'black';


  var currentPrimary = null;
  var currentSecondary = null;

  function primarySelect(id, keepPrevious){
    if(!keepPrevious && currentPrimary){
      currentPrimary.style('fill', defaultColor);
    }
    currentPrimary = d3.select(id);
    currentPrimary.style('fill', primaryColor);
  }

  function secondarySelect(id, keepPrevious){
    if(!keepPrevious && currentSecondary){
      currentSecondary.style('fill', defaultColor);
    }
    currentSecondary = d3.select(id);
    currentSecondary.style('fill', secondaryColor);
  }

  function deselect(id){
    d3.select(id).style('fill', defaultColor);
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
    primarySelect: primarySelect,
    secondarySelect: secondarySelect,
    createAction: createAction,
    swap: swap,
    deselect: deselect
  };
});