define(['svgController', 'util/constants'],
function(svgController,   constants){
  var actions;
  var step;  

  //1.247330950103979
  //1.3
  var shrinkFactor = 1.24;

  // TODO below was copypasta'd from bubblesort. need to make this common code
  // BEGIN COPY PASTA
  function addAction(command, params){
    actions.push(svgController.createAction(step, command, params));
  }
  function deselect(type){
    addAction('deselect', {
      type: type
    });
  }
  function select(datum, type){
    addAction('select', {
      datum: datum,
      type: type
    });
    return true;
  }
  function selectSorted(datum){
    addAction('setColor', {
      datum: datum,
      color: constants.colors.sorted
    });
  }
  function swap(list, outer, inner){
    addAction('swapColorAndHorizontalPosition', [list[outer], list[inner]]);
    var tmp = list[outer];
    list[outer] = list[inner];
    list[inner] = tmp;
  }
  // END COPY PASTA

  function selectAllSorted(list){
    while(list.length){
      addAction('setColor', {
        datum: list.splice(0, 1),
        color: constants.colors.sorted
      })
    }
  }

  return function sort(list, ascending){
    actions = [];
    step = 0;

    var gap = list.length-1;
    var swapped = false;

    while(gap > 1 || swapped === true){
      gap = Math.floor(gap/shrinkFactor) || 1;
      swapped = false;
      for(var inner = 0; inner<list.length-gap; inner++){
        select(list[inner], 'primary');
        select(list[inner+gap], 'secondary');
        step++

        var outOfOrder = (ascending && list[inner+gap]<list[inner]) || (!ascending && list[inner+gap]>list[inner]);
        if(outOfOrder){
          swap(list, inner, inner+gap);
          step++;
          swapped = true;
        }
      }
    }
    deselect('primary');
    deselect('secondary');
    selectAllSorted(list);
    return actions;
  }
});