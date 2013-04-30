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
    select(datum, constants.colors.primary);
    currentPrimary = datum;
  }

  function selectSecondary(datum){
    if(currentSecondary!==undefined){
      deselect(currentSecondary);
    }
    select(datum, constants.colors.secondary);
    currentSecondary = datum;
  }

  function selectSorted(datum){
    select(datum, constants.colors.sorted);
    currentPrimary = undefined;
    currentSecondary = undefined;
  }

  function swap(primary, secondary){
    addAction('swapPosition', [primary, secondary]);
    currentPrimary = secondary;
    currentSecondary = primary;
  }

  return function sort(list, ascending){
    // reset variables
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
          // transfer primary select to new max or min
          selectPrimary(list[inner]);
          currentSecondary = undefined;
          swapIndex = inner;
          // edge case to add a step showing primary select on last index
          if(inner===innerMax){
            step++;
          }
        }
      }
      // remove secondary select
      deselect(currentSecondary);
      currentSecondary = undefined;
      // perform swap if needed
      if(swapIndex !== outer){
        swap(list[outer], list[swapIndex]);
        var tmp = list[outer];
        list[outer] = list[swapIndex];
        list[swapIndex] = tmp;
        step++;
      }
      // mark current index as sorted
      selectSorted(list[outer]);
      step++;
    }
    selectSorted(list[innerMax]);
    return actions;
  };
});