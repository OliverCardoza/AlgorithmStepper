define(['svgController', 'util/constants'],
function(svgController,   constants){
  var actions;
  var step;
  var list;
  var ascending;

  var current = {};
  var colors = {
    pivot: constants.colors.tertiary,
    primary: constants.colors.primary,
    secondary: constants.colors.secondary,
    default: constants.colors.default
  };

  function addAction(command, params){
    actions.push(svgController.createAction(step, command, params));
  }

  function select(type, datum){
    if(type && current[type]){
      deselect(current[type]);
    }
    addAction('setColor', {
      datum: datum,
      color: colors[type]
    });
    if(type && type!=='default'){
      current[type] = datum;
    }
  }

  function deselect(datum){
    select(null, datum);
  }
  function selectPivot(datum){
    select('pivot', datum);
  }
  function selectPrimary(datum){
    select('primary', datum);
  }
  function selectSecondary(datum){
    select('secondary', datum);
  }

  function swap(idx1, idx2){
    var tmp = list[idx1];
    list[idx1] = list[idx2];
    list[idx2] = tmp;
  }

  function swapPosition(idx1, idx2){
    addAction('swapHorizontalPosition', [list[idx1], list[idx2]]);
    swap(idx1, idx2);
  }

  function swapColorAndPosition(idx1, idx2){
    addAction('swapColorAndHorizontalPosition', [list[idx1], list[idx2]]);
    swap(idx1, idx2);
  }

  // TODO: exit condition on small space
  function sort(leftIndex, rightIndex, pivotIndex){
    var primaryIndex;
    var secondaryIndex;

    selectPivot(list[pivotIndex]);
    step++;
    if(rightIndex !== pivotIndex){
      swapPosition(pivotIndex, rightIndex);
      pivotIndex = rightIndex;
      step++;
    }

    primaryIndex = leftIndex;
    selectPrimary(list[leftIndex]);
    step++
    for(secondaryIndex = leftIndex, max = rightIndex-1; secondaryIndex<max; secondaryIndex++){
      if(secondaryIndex !== primaryIndex){
        selectSecondary(list[secondaryIndex]);
        step++
      }
      var outOfOrder = (ascending && list[secondaryIndex]<list[pivotIndex]) || (!ascending && list[secondaryIndex]>list[pivotIndex]);
      if(outOfOrder){
        if(secondaryIndex !== primaryIndex){
          swapColorAndPosition(secondaryIndex, primaryIndex);
          step++;
        }
        primaryIndex++;
        selectPrimary(list[primaryIndex]);
        step++;
      }
    }
    // TODO: stuff here
    

  }

  return function quickSort(l, asc){
    actions = [];
    step = 0;
    list = l;
    ascending = (asc === undefined) ? true : asc;

    // sort(0, list.length-1, Math.floor(Math.random()*list.length));
    sort(0, list.length-1, 3);
    return actions;
  };
});