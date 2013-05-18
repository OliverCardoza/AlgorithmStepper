define(['svgController', 'util/constants'],
function(svgController,   constants){
  var actions;
  var step;

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
  // TODO: change to without color
  function swap(list, outer, inner){
    addAction('swapColorAndHorizontalPosition', [list[outer], list[inner]]);
    var tmp = list[outer];
    list[outer] = list[inner];
    list[inner] = tmp;
  }

  return function sort(list, ascending){
    actions = [];
    step = 0;

    for(var outer=0; (outer<list.length-1) && select(list[outer], 'primary'); outer++){
      for(var inner=outer+1; (inner<list.length) && select(list[inner], 'secondary'); inner++){
        step++
        var outOfOrder = (ascending && list[outer]>list[inner]) || (!ascending && list[outer]<list[inner]);
        if(outOfOrder){
          swap(list, outer, inner);
          step++;
        }
      }
      selectSorted(list[outer]);
    }
    selectSorted(list[list.length-1]);
    deselect('primary');
    deselect('secondary');
    return actions;
  }
});