define(['step/StepBuilder'],
function(StepBuilder){
  function sortSubarray(list, ascending, sb, leftIndex, rightIndex){
    console.log('sorting: ', leftIndex, '-', rightIndex);
    if(leftIndex === rightIndex){
    } else if (leftIndex-rightIndex === 1){
      var outOfOrder = (ascending && list[leftIndex]>list[rightIndex]) || (!ascending && list[leftIndex]<list[rightIndex]);
      if(outOfOrder){
        sb.swap(list, leftIndex, rightIndex);
      }
    } else {
      var pivotIndex = Math.floor((leftIndex+rightIndex)/2);
      sortSubarray(list, ascending, sb, leftIndex, pivotIndex);
      sortSubarray(list, ascending, sb, pivotIndex+1, rightIndex);
    }
  }

  return function sort(list, ascending){
    var sb = new StepBuilder();

    sortSubarray(list, ascending, sb, 0, list.length-1);

    return sb.steps;
  };
});

// define(['step/StepBuilder'],
// function(StepBuilder){
//   return function sort(list, ascending){
//     var sb = new StepBuilder();

//     for(var outer=0; (outer<list.length-1) && sb.select(list[outer], 'primary'); outer++){
//       for(var inner=outer+1; (inner<list.length) && sb.select(list[inner], 'secondary'); inner++){
//         sb.incrementStep();
//         var outOfOrder = (ascending && list[outer]>list[inner]) || (!ascending && list[outer]<list[inner]);
//         if(outOfOrder){
//           sb.swap(list, outer, inner);
//           sb.incrementStep()
//         }
//       }
//       sb.selectSorted(list[outer]);
//     }
//     sb.selectSorted(list[list.length-1]);
//     sb.deselect('primary');
//     sb.deselect('secondary');
//     return sb.steps;
//   }
// });