define(['algorithms/bubbleSort', 'algorithms/selectionSort', 'algorithms/insertionSort', 'algorithms/combSort', 'algorithms/quickSort'],
function(bubbleSort,              selectionSort,              insertionSort,              combSort,              quickSort){
  return {
    bubbleSort: bubbleSort,
    selectionSort: selectionSort,
    insertionSort: insertionSort,
    combSort: combSort,
    quickSort: quickSort
  };
});