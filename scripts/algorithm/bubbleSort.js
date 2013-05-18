define(['svgController', 'util/constants'],
function(svgController,   constants){
  var actions;
  var step;

  var currentPrimary;
  var currentSecondary;

  function addAction(command, params){
    actions.push(svgController.createAction(step, command, params));
  }

  function deselect(datum, type){
    // addAction('setColor', {
    //   datum: datum,
    //   color: constants.colors.default
    // });
    if(type){
      addAction('deselect', {
        type: type
      });
    }
  }

  function select(datum, isPrimary){
    var deselectPrev = (isPrimary&&(currentPrimary!==undefined)) || (!isPrimary&&(currentSecondary!==undefined));
    if(deselectPrev){
      deselect(isPrimary?currentPrimary:currentSecondary);
    }

    if(isPrimary){
      addAction('select', {
        datum: datum,
        type: 'primary'
      });
    } else {
      // addAction('setColor', {
      //   datum: datum,
      //   color: isPrimary?constants.colors.primary:constants.colors.secondary
      // });
      addAction('select', {
        datum: datum,
        type: 'secondary'
      });
    }

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
    addAction('swapColorAndHorizontalPosition', [primary, secondary]);
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
      step++
    }
    deselect(null, 'primary');
    deselect(null, 'secondary');
    selectSorted(list[innerMax]);
    return actions;
  }
});