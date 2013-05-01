define(['svgController', 'util/constants'],
function(svgController,   constants){
  var actions;
  var step;

  var currentPrimary;
  var currentSecondary;

  function addAction(command, params){
    actions.push(svgController.createAction(step, command, params));
  }

  function deselect(datum){
    addAction('setColor', {
      datum: datum,
      color: constants.colors.default
    });
  }

  function select(datum, isPrimary){
    var deselectPrev = (isPrimary&&(currentPrimary!==undefined)) || (!isPrimary&&(currentSecondary!==undefined));
    if(deselectPrev){
      deselect(isPrimary?currentPrimary:currentSecondary);
    }

    addAction('setColor', {
      datum: datum,
      color: isPrimary?constants.colors.primary:constants.colors.secondary
    });

    if(isPrimary){
      currentPrimary = datum;
    } else {
      currentSecondary = datum;
    }
  }

  function selectSorted(datum){
    addAction('setColor', {
      datum: datum,
      color: constants.colors.sorted
    });
    currentPrimary = undefined;
    currentSecondary = undefined;
  }

  function swap(primary, secondary){
    addAction('swapColorAndPosition', [primary, secondary]);
    currentPrimary = secondary;
    currentSecondary = primary;
  }

  return function sort(list, ascending){
    actions = [];
    step = 0;
    currentPrimary = undefined;
    currentSecondary = undefined;

    ascending = (ascending === undefined) ? true : ascending;
    var outer;
    var inner;
    var outerMax;
    var innerMax;
    for(outer=0, outerMax=list.length-2; outer<=outerMax; outer++){
      select(list[outer], true);
      for(inner=outer+1, innerMax=list.length-1; inner<=innerMax; inner++){
        select(list[inner], false);
        step++
        var outOfOrder = (ascending && list[outer]>list[inner]) || (!ascending && list[outer]<list[inner]);
        if(outOfOrder){
          swap(list[outer], list[inner]);
          var tmp = list[outer];
          list[outer] = list[inner];
          list[inner] = tmp;
          step++;
        }
      }
      deselect(currentSecondary);
      selectSorted(list[outer]);
    }
    selectSorted(list[innerMax]);
    return actions;
  }
});