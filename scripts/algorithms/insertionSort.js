define(['util/StepBuilder', 'util/constants'],
function(StepBuilder,   constants){
  
  // TODO: migrate these into StepBuilder if pertinent or create general API in StepBuilder to utilize
  function selectPrimary(sb, datum){
    sb.addAction('setColorAndShift', {
      datum: datum,
      color: constants.colors.primary,
      xUnits: 0,
      yUnits: -1
    });
  }
  function deselectPrimary(sb, datum, unitsToLeft){
    sb.addAction('setColorAndShift', {
      datum: datum,
      color: constants.colors.sorted,
      xUnits: -1*unitsToLeft,
      yUnits: 1
    });
  }

  function shift(sb, datum){
    sb.addAction('shift', {
      datum: datum,
      xUnits: 1,
      yUnits: 0
    });
  }

  return function sort(list, ascending){
    var sb = new StepBuilder();

    sb.selectSorted(list[0]);
    sb.incrementStep();

    for(var outer=1, outerMax=list.length; outer<outerMax; outer++){
      var tmp = list[outer];
      selectPrimary(sb, tmp);
      sb.incrementStep();
      for(var inner=outer-1; inner>=0; inner--){

        var outOfOrder = (ascending && tmp<list[inner]) || (!ascending && tmp>list[inner]);
        if(outOfOrder){
          list[inner+1] = list[inner];
          shift(sb, list[inner]);
          sb.incrementStep();
        } else {
          break;
        }
      }
      list[inner+1] = tmp;
      deselectPrimary(sb, tmp, outer-inner-1);
      sb.incrementStep();
    }
    return sb.steps;
  };
});