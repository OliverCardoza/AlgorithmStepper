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
    list = list.slice(); // make a copy
    ascending = (ascending === undefined) ? true : ascending;

    var outer;
    var inner;
    var outerMax;

    for(outer=1, outerMax=list.length-1; outer<=outerMax; outer++){
      var tmp = list[outer];
      var changesMade = false;
      for(inner=outer-1; inner>=0; inner--){
        var outOfOrder = (ascending && tmp<list[inner]) || (!ascending && tmp>list[inner]);
        if(outOfOrder){
          list[inner+1] = list[inner];
          changesMade = true;
        } else {
          break;
        }
      }
      if(changesMade){
        list[inner+1] = tmp;
      }
    }
  };
});