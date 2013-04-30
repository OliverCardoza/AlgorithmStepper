requirejs(['StepController', 'algorithm/bubbleSort', 'algorithm/selectionSort', 'algorithm/insertionSort'],
function(   StepController,   bubbleSort,             selectionSort,             insertionSort) {
  var playButton = document.getElementById('play');
  var pauseButton = document.getElementById('pause');
  var stopButton = document.getElementById('stop');

  var controller;
  var data = [20, 60, 10, 50, 90, 30]; // TODO: replace with generator

  function setNewAlgorithm(name){
    if(controller){
      controller.stop();
      playButton.removeEventListener('click', controller.play);
      pauseButton.removeEventListener('click', controller.pause);
      stopButton.removeEventListener('click', controller.stop);
    }
    var actions;
    // TODO: add ability for user to input sort parameters (asc/desc to start)
    switch(name){
      case 'bubbleSort':
        actions = bubbleSort(data, true);
        break;
      case 'selectionSort':
        actions = selectionSort(data, true);
        break;
      case 'insertionSort':
        actions = insertionSort(data, true);
      default:
        throw new Error('Bad algorithm name.');
    }

    controller = new StepController(data, actions);
    playButton.addEventListener('click', controller.play, false);
    pauseButton.addEventListener('click', controller.pause, false);
    stopButton.addEventListener('click', controller.stop, false);
    controller.play();
  }

  document.getElementById('bubbleSort')
    .addEventListener('click', function(){ setNewAlgorithm('bubbleSort'); }, false); // TODO, what is third argument of addEventListener?
  document.getElementById('selectionSort')
    .addEventListener('click', function(){ setNewAlgorithm('selectionSort'); }, false);
  document.getElementById('insertionSort')
    .addEventListener('click', function(){ setNewAlgorithm('insertionSort'); }, false);
});