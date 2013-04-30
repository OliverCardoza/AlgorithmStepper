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
      color: constants.defaultColor
    });
  }

  function select(datum, color){
    addAction('setColor', {
      datum: datum,
      color: color
    });
  }

  function selectPrimary(datum){
    if(currentPrimary!==undefined){
      deselect(currentPrimary);
    }
    select(datum, constants.selectionSort.primaryColor);
    currentPrimary = datum;
  }

  function selectSecondary(datum){
    if(currentSecondary!==undefined){
      deselect(currentSecondary);
    }
    select(datum, constants.selectionSort.secondaryColor);
    currentSecondary = datum;
  }

  function selectSorted(datum){
    select(datum, constants.selectionSort.sortedColor);
    currentPrimary = undefined;
    currentSecondary = undefined;
  }

  function swap(primary, secondary){
    addAction('swapPosition', [primary, secondary]);
    currentPrimary = secondary;
    currentSecondary = primary;
  }

  return function sort(list, ascending){
    actions = [];
    step = 0;
    currentPrimary = undefined;
    currentSecondary = undefined;

    list = list.slice(); // make a copy
    ascending = (ascending === undefined) ? true : ascending;
    var outer;
    var inner;
    var outerMax;
    var innerMax;
    var swapIndex;
    for(outer=0, outerMax=list.length-2; outer<=outerMax; outer++){
      selectPrimary(list[outer]);
      for(inner=outer+1, innerMax=list.length-1, swapIndex = outer; inner<=innerMax; inner++){
        selectSecondary(list[inner]);
        step++;
        var outOfOrder = (ascending && list[swapIndex]>list[inner]) || (!ascending && list[swapIndex]<list[inner]);
        if(outOfOrder){
          selectPrimary(list[inner]);
          currentSecondary = undefined;
          swapIndex = inner;
          if(inner===innerMax){
            step++;
          }
        }
      }
      deselect(currentSecondary);
      currentSecondary = undefined;
      if(swapIndex !== outer){
        swap(list[outer], list[swapIndex]);
        var tmp = list[outer];
        list[outer] = list[swapIndex];
        list[swapIndex] = tmp;
        step++;
      }
      selectSorted(list[outer]);
      step++;
    }
    selectSorted(list[innerMax]);
    return actions;
  };
});