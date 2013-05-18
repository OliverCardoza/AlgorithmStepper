define(['svgController', 'util/constants'],
function(svgController,   constants){
  var actions;
  var step;

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

  return function sort(list, ascending){
    // reset variables
    actions = [];
    step = 0;

    var swapIndex;

    for(var outer=0; (outer<list.length-1) && select(list[outer], 'primary'); outer++){
      for(var inner=outer+1, swapIndex = outer; (inner<list.length) && select(list[inner], 'secondary'); inner++){
        step++;

        var outOfOrder = (ascending && list[swapIndex]>list[inner]) || (!ascending && list[swapIndex]<list[inner]);
        if(outOfOrder){
          // transfer primary select to new max or min
          select(list[inner], 'primary');
          deselect('secondary');
          step++;
          swapIndex = inner;
          // edge case to add a step showing primary select on last index
          if(inner===list.length-1){
            // step++;
          }
        }
      }
      // remove secondary select
      // deselect(currentSecondary);
      deselect('secondary');
      // perform swap if needed
      if(swapIndex !== outer){
        swap(list, outer, swapIndex);
        step++;
      }
      // mark current index as sorted
      selectSorted(list[outer]);
      step++;
    }
    selectSorted(list[list.length-1]);
    return actions;
  };
});