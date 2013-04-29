requirejs(['stepController'],
function(   StepController) {
  var controller = new StepController('bubblesort');

  document.getElementById('play').addEventListener('click', controller.play, false);
  document.getElementById('pause').addEventListener('click', controller.pause, false);
  document.getElementById('stop').addEventListener('click', controller.stop, false);
  controller.play();
});
// TODO: rename modules that are classes with capitals