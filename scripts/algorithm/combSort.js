
define(['svgController', 'util/constants'],
function(svgController,   constants){
  var actions;
  var step;

  var currentPrimary;
  var currentSecondary;

  //1.247330950103979
  //1.3
  var shrinkFactor = 1.24;

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
    var deselectPrev = (isPrimary&&(currentPrimary!==undefined)) || (!isPrimary&&(currentSecondary!==undefined)&&currentSecondary!==currentPrimary);
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

  function swap(primary, secondary){
    addAction('swapPosition', [primary, secondary]);
  }

  function selectAllSorted(list){
    while(list.length){
      addAction('setColor', {
        datum: list.splice(0, 1),
        color: constants.colors.sorted
      })
    }
  }

  return function sort(list, ascending){
    actions = [];
    step = 0;
    currentPrimary = undefined;
    currentSecondary = undefined;

    ascending = (ascending === undefined) ? true : ascending;

    var gap = list.length-1;
    var swapped = false;
    var inner;
    var innerMax;

    while(gap > 1 || swapped === true){
      gap = Math.floor(gap/shrinkFactor) || 1;
      swapped = false;
      for(inner = 0, innerMax = list.length-gap-1; inner<=innerMax; inner++){
        select(list[inner], true);
        select(list[inner+gap], false);
        step++
        var outOfOrder = (ascending && list[inner+gap]<list[inner]) || (!ascending && list[inner+gap]>list[inner]);
        if(outOfOrder){
          swap(list[inner], list[inner+gap]);
          step++;
          var tmp = list[inner+gap];
          list[inner+gap] = list[inner];
          list[inner] = tmp;
          swapped = true;
        }
      }
    }
    selectAllSorted(list);
    return actions;
  }
});