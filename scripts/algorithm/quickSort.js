define(['svgController', 'util/constants'],
function(svgController,   constants){
  var actions;
  var step;

  var currentPivot;

  function addAction(command, params){
    actions.push(svgController.createAction(step, command, params));
  }

  function selectPivot(datum){
    addAction('setColor', {
      datum: datum,
      color: constants.colors.tertiary
    });
    currentPivot = datum;
  }

  function sort(list, leftIndex, rightIndex, pivotIndex){
    selectPivot(list[pivotIndex]);
  }

  return function quickSort(list, ascending){
    actions = [];
    step = 0;

    sort(list, 0, list.length-1, Math.floor(Math.random()*list.length));

    return actions;
  };
});