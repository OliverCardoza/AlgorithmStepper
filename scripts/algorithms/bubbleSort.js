define(['util/StepBuilder'],
function(StepBuilder){
  return function sort(list, ascending){
    var sb = new StepBuilder();

    for(var outer=0; (outer<list.length-1) && sb.select(list[outer], 'primary'); outer++){
      for(var inner=outer+1; (inner<list.length) && sb.select(list[inner], 'secondary'); inner++){
        sb.incrementStep();
        var outOfOrder = (ascending && list[outer]>list[inner]) || (!ascending && list[outer]<list[inner]);
        if(outOfOrder){
          sb.swap(list, outer, inner);
          sb.incrementStep()
        }
      }
      sb.selectSorted(list[outer]);
    }
    sb.selectSorted(list[list.length-1]);
    sb.deselect('primary');
    sb.deselect('secondary');
    return sb.steps;
  }
});