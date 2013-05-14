requirejs(['util/constants', 'StepController', 'algorithm/bubbleSort', 'algorithm/selectionSort', 'algorithm/insertionSort', 'algorithm/combSort'],
function(   constants,        StepController,   bubbleSort,             selectionSort,             insertionSort,             combSort) {
  // Control Buttons
  var playButton = document.getElementById('play');
  var pauseButton = document.getElementById('pause');
  var stopButton = document.getElementById('stop');

  var controller;
  var data = [20, 60, 10, 50, 90, 30]; // TODO: replace with generator
  // var data = [4, 12, 2, 10, 18, 6];
  // var data = [12, 45, 11, 77, 2, 99, 39, 36, 85];

  // Algorithm Switcher
  function setNewAlgorithm(name){
    if(controller){
      controller.stop();
      playButton.removeEventListener('click', controller.play);
      pauseButton.removeEventListener('click', controller.pause);
      stopButton.removeEventListener('click', controller.stop);
    }
    var actions;
    var dataCopy = data.slice();
    // TODO: add ability for user to input sort parameters (asc/desc to start)
    switch(name){
      case 'bubbleSort':
        actions = bubbleSort(dataCopy, true);
        break;
      case 'selectionSort':
        actions = selectionSort(dataCopy, true);
        break;
      case 'insertionSort':
        actions = insertionSort(dataCopy, true);
        break;
      case 'combSort':
        actions = combSort(dataCopy, true);
        break;
      default:
        throw new Error('Bad algorithm name.');
        break;
    }

    // Potentially also give StepController svgController params (setup width/height and x/y units)
    controller = new StepController(data, actions);
    playButton.addEventListener('click', controller.play, false);
    pauseButton.addEventListener('click', controller.pause, false);
    stopButton.addEventListener('click', controller.stop, false);
    controller.play();
  }

  // Algorithm buttons
  document.getElementById('bubbleSort')
    .addEventListener('click', function(){ setNewAlgorithm('bubbleSort'); }, false);
  document.getElementById('selectionSort')
    .addEventListener('click', function(){ setNewAlgorithm('selectionSort'); }, false);
  document.getElementById('insertionSort')
    .addEventListener('click', function(){ setNewAlgorithm('insertionSort'); }, false);
  document.getElementById('combSort')
    .addEventListener('click', function(){ setNewAlgorithm('combSort'); }, false);

  // Speed Changer
  var speedInput = document.getElementById('speed');
  // This is fugly but is it worth adding another library?
  speedInput.addEventListener('change', function(e){
    constants.stepInterval = constants.baseStepInterval / e.srcElement.value;
    constants.transitionDuration = constants.stepInterval*0.9;
    if(controller){
      controller.changeSpeed();
    }
  }, false);
  if ("fireEvent" in speedInput)
      speedInput.fireEvent("onchange");
  else
  {
      var evt = document.createEvent("HTMLEvents");
      evt.initEvent("change", false, true);
      speedInput.dispatchEvent(evt);
  }
});