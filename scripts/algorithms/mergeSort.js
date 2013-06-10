define(['step/StepBuilder'],
function(StepBuilder){
  // in-place combination of 2 sorted subarrays
  function combineSubarrays(list, ascending, sb, leftIndex, pivotIndex, rightIndex){
    var subarray = list.slice(leftIndex, rightIndex+1);
    var leftPtr = 0;
    var rightPtr = pivotIndex-leftIndex+1;
    var currentIndex = leftIndex;

    while (currentIndex<rightIndex+1) {
      var pickLeft = true;
      // pick right if finished left subarray
      if (leftPtr>(pivotIndex-leftIndex)) {
        pickLeft = false;
      // pick right if ascending order and right<left
      } else if (ascending && subarray[leftPtr]>subarray[rightPtr]) {
        pickLeft = false;
      } else if (!ascending && subarray[leftPtr]<subarray[rightPtr]) {
        pickLeft = false;
      }

      if (pickLeft) {
        list[currentIndex] = subarray[leftPtr];
        leftPtr++;
      } else {
        list[currentIndex] = subarray[rightPtr];
        rightPtr++;
      }
      currentIndex++;
    }
  }

  // ignore if subarray length=1, break up and recombine if length>2
  function sortSubarray(list, ascending, sb, leftIndex, rightIndex){
    if(leftIndex !== rightIndex){
      var pivotIndex = Math.floor((leftIndex+rightIndex)/2);
      sortSubarray(list, ascending, sb, leftIndex, pivotIndex);
      sortSubarray(list, ascending, sb, pivotIndex+1, rightIndex);
      combineSubarrays(list, ascending, sb, leftIndex, pivotIndex, rightIndex)
    }
  }

  return function sort(list, ascending){
    var sb = new StepBuilder();

    sortSubarray(list, ascending, sb, 0, list.length-1);
    return sb.steps;
  };
});