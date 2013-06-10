define(['algorithms/bubbleSort', 'algorithms/selectionSort', 'algorithms/insertionSort', 'algorithms/combSort', 'algorithms/quickSort', 'algorithms/mergeSort'],
function(bubbleSort,              selectionSort,              insertionSort,              combSort,              quickSort,              mergeSort){
  return {
    bubbleSort: bubbleSort,
    selectionSort: selectionSort,
    insertionSort: insertionSort,
    combSort: combSort,
    quickSort: quickSort,
    mergeSort: mergeSort
  };
});