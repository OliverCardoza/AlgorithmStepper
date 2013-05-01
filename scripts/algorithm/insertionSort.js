define(['svgController', 'util/constants'],
function(svgController,   constants){
  var actions;
  var step;

  function addAction(command, params){
    actions.push(svgController.createAction(step, command, params));
  }

  function selectPrimary(datum){
    addAction('setColorAndShift', {
      datum: datum,
      color: constants.colors.primary,
      xUnits: 0,
      yUnits: -1
    });
  }
  function deselectPrimary(datum, unitsToLeft){
    addAction('setColorAndShift', {
      datum: datum,
      color: constants.colors.sorted,
      xUnits: -1*unitsToLeft,
      yUnits: 1
    });
  }

  function shift(datum){
    addAction('shift', {
      datum: datum,
      xUnits: 1,
      yUnits: 0
    });
  }

  function selectSorted(datum){
    addAction('setColor', {
      datum: datum,
      color: constants.colors.sorted
    });
  }

  return function sort(list, ascending){
    actions = [];
    step = 0;

    ascending = (ascending === undefined) ? true : ascending;

    var outer;
    var inner;
    var outerMax;

    selectSorted(list[0]);
    step++;
    for(outer=1, outerMax=list.length-1; outer<=outerMax; outer++){
      var tmp = list[outer];
      selectPrimary(tmp);
      step++;
      for(inner=outer-1; inner>=0; inner--){
        var outOfOrder = (ascending && tmp<list[inner]) || (!ascending && tmp>list[inner]);
        if(outOfOrder){
          list[inner+1] = list[inner];
          shift(list[inner]);
          step++;
        } else {
          break;
        }
      }
      list[inner+1] = tmp;
      deselectPrimary(tmp, outer-inner-1);
      step++;
    }
    return actions;
  };
});