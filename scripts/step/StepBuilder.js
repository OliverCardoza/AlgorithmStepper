// Class used by algorithms to create the 'steps' data structure used by the StepController
define(['svgController', 'util/constants'],
function(svgController,   constants){
  return function StepBuilder(){
    // Array of steps, each step is an array of actions
    var steps = [];
    var currentStep = 0;

    this.addAction = function(action, params){
      if(!steps[currentStep]){
        steps[currentStep] = [];
      }
      steps[currentStep].push(svgController.createAction(action, params));
    }

    this.incrementStep = function(){
      currentStep++;
    };

    this.deselect = function(type){
      this.addAction('deselect', {
        type: type
      });
    };

    this.select = function(datum, type){
      this.addAction('select', {
        datum: datum,
        type: type
      });
      return true;
    };

    this.selectSorted = function(datum){
      this.addAction('setColor', {
        datum: datum,
        color: constants.colors.sorted
      });
    };

    this.selectAllSorted = function(list){
      while(list.length){
        this.addAction('setColor', {
          datum: list.splice(0, 1),
          color: constants.colors.sorted
        })
      }
    };

    this.swap = function(list, outer, inner){
      this.addAction('swapColorAndHorizontalPosition', [list[outer], list[inner]]);
      var tmp = list[outer];
      list[outer] = list[inner];
      list[inner] = tmp;
    };

    this.steps = steps;
  };
});