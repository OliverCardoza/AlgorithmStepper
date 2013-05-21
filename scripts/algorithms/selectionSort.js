define(['step/StepBuilder', 'util/constants'],
function(StepBuilder,        constants){
  return function sort(list, ascending){
    var sb = new StepBuilder();
    var swapIndex;

    for(var outer=0; (outer<list.length-1) && sb.select(list[outer], 'primary'); outer++){
      for(var inner=outer+1, swapIndex = outer; (inner<list.length) && sb.select(list[inner], 'secondary'); inner++){
        sb.incrementStep();

        var outOfOrder = (ascending && list[swapIndex]>list[inner]) || (!ascending && list[swapIndex]<list[inner]);
        if(outOfOrder){
          // transfer primary select to new max or min
          sb.select(list[inner], 'primary');
          sb.incrementStep();
          swapIndex = inner;
        }
      }
      // remove secondary select
      sb.deselect('secondary');
      sb.incrementStep();
      // perform swap if needed
      if(swapIndex !== outer){
        sb.swap(list, outer, swapIndex);
        sb.incrementStep();
      }
      // mark current index as sorted
      sb.selectSorted(list[outer]);
      sb.incrementStep();
    }
    sb.deselect('primary');
    sb.selectSorted(list[list.length-1]);
    return sb.steps;
  };
});