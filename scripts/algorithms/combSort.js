define(['step/StepBuilder', 'util/constants'],
function(StepBuilder,        constants){
  return function sort(list, ascending){
    var sb = new StepBuilder();
    var gap = list.length-1;
    var swapped = false;

    while(gap > 1 || swapped === true){
      gap = Math.floor(gap/constants.combSort.shrinkFactor) || 1;
      swapped = false;
      for(var inner = 0; inner<list.length-gap; inner++){
        sb.select(list[inner], 'primary');
        sb.select(list[inner+gap], 'secondary');
        sb.incrementStep();

        var outOfOrder = (ascending && list[inner+gap]<list[inner]) || (!ascending && list[inner+gap]>list[inner]);
        if(outOfOrder){
          sb.swap(list, inner, inner+gap);
          sb.incrementStep();
          swapped = true;
        }
      }
    }
    sb.deselect('primary');
    sb.deselect('secondary');
    sb.selectAllSorted(list);
    return sb.steps;
  }
});