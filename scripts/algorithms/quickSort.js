define(['step/StepBuilder', 'util/constants'],
function(StepBuilder,   constants){

  function selectPivot(sb, datum){
    sb.addAction('setColor', {
      datum: datum,
      color: constants.colors.tertiary
    });
  }

  function sortSubarray(list, ascending, sb, leftIndex, rightIndex, pivotIndex){
    // TODO: select subarray as focus
    if(leftIndex >= rightIndex){
      sb.selectSorted(list[leftIndex]);
      sb.selectSorted(list[rightIndex]);
      sb.incrementStep();
      return;
    }

    var primaryIndex = leftIndex;

    // move pivot to end
    selectPivot(sb, list[pivotIndex]);
    sb.incrementStep();
    sb.swap(list, pivotIndex, rightIndex);
    pivotIndex = rightIndex;
    sb.incrementStep();
    sb.select(list[primaryIndex], 'primary');

    for(var secondaryIndex=leftIndex; secondaryIndex<rightIndex && sb.select(list[secondaryIndex], 'secondary'); secondaryIndex++){
      sb.incrementStep();
      var outOfOrder = (ascending && list[secondaryIndex]<list[pivotIndex]) || (!ascending && list[secondaryIndex]>list[pivotIndex]);
      if(outOfOrder){
        if(primaryIndex !== secondaryIndex){
          sb.swap(list, primaryIndex, secondaryIndex);
          sb.incrementStep();
        }
        
        primaryIndex++;
        sb.select(list[primaryIndex], 'primary');
      }
    }
    // Finishing up by swapping pivot into correct spot and selecting it as sorted
    sb.deselect('secondary');
    sb.incrementStep();
    sb.swap(list, primaryIndex, pivotIndex);
    pivotIndex = primaryIndex;
    sb.incrementStep();
    sb.deselect('primary');
    sb.selectSorted(list[pivotIndex]);
    sb.incrementStep();

    // TODO change to random pivot
    // TODO: select all as normal again
    sortSubarray(list, ascending, sb, leftIndex, pivotIndex-1, Math.floor((pivotIndex-1+leftIndex)/2));
    sortSubarray(list, ascending, sb, pivotIndex+1, rightIndex, Math.floor((pivotIndex+1+rightIndex)/2));
  }

  return function quickSort(list, ascending){
    sb = new StepBuilder();

    // TODO change to random pivot
    sortSubarray(list, ascending, sb, 0, list.length-1, 3);

    return sb.steps;
  };
});