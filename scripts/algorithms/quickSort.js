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
    if(current[type]){
      deselect(current[type]);
    }
    addAction('setColor', {
      datum: datum,
      color: colors[type]
    });
    if(type!=='default'){
      current[type] = datum;
    }
  }

  function deselect(datum){
    select('default', datum);
  }
  function selectPivot(datum){
    select('pivot', datum);
  }
  function selectSecondary(datum){
    select('secondary', datum);
  }

  function selectPrimary(datum){
    addAction('setColorAndShift', {
      datum: datum,
      color: colors['primary'],
      xUnits: 0,
      yUnits: -1
    });
    current['primary'] = datum;
  }
  function deselectPrimary(){
    addAction('setColorAndShift', {
      datum: current['primary'],
      color: colors['default'],
      xUnits: 0,
      yUnits: 1
    });
    current['primary'] = null;
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

  // function swapColorAndPosition(idx1, idx2){
  //   addAction('swapColorAndHorizontalPosition', [list[idx1], list[idx2]]);
  //   swap(idx1, idx2);
  // }

  // TODO: exit condition on small space
  function sort2(leftIndex, rightIndex, pivotIndex){
    var primaryIndex = leftIndex;
    var secondaryIndex;

    // Select pivot and move to the end
    selectPivot(list[pivotIndex]);
    step++;
    if(rightIndex !== pivotIndex){
      swapPosition(pivotIndex, rightIndex);
      pivotIndex = rightIndex;
      step++;
    }

    // Select leftmost element as primary
    selectPrimary(list[primaryIndex]);
    step++

    for(secondaryIndex = leftIndex, max = rightIndex; secondaryIndex<max; secondaryIndex++){
      if(secondaryIndex !== primaryIndex){
        selectSecondary(list[secondaryIndex]);
        step++
      }

      var outOfOrder = (ascending && list[secondaryIndex]<list[pivotIndex]) || (!ascending && list[secondaryIndex]>list[pivotIndex]);
      if(outOfOrder){
        if(secondaryIndex !== primaryIndex){
          swapPosition(secondaryIndex, primaryIndex);
          step++;
          return;
          var oldSecondary = secondaryIndex;
          secondaryIndex = primaryIndex;
          primaryIndex++;
          current['primary'] = list[primaryIndex];

          deselect(list[secondaryIndex]);
          step++;
        }
        // fix primary/secondary pointers and deselect secondary
        
        
        deselectPrimary();
        selectPrimary(list[primaryIndex]);
        step++;
      }
    }
    swapPosition(primaryIndex, pivotIndex);
    step++;
    deselect(list[primaryIndex]);
    // TODO: stuff here
  }

  function sortSubarray(leftIndex, rightIndex, pivotIndex){
    var primaryIndex = leftIndex;

    swap(pivotIndex, rightIndex);

    for(var secondaryIndex=leftIndex, max=rightIndex; secondaryIndex<max; secondaryIndex++){
      var outOfOrder = (ascending && list[secondaryIndex]<list[pivotIndex]) || (!ascending && list[secondaryIndex]>list[pivotIndex]);
      if(outOfOrder){
        swap(primaryIndex, secondaryIndex);
        primaryIndex++;
      }
    }
  }

  return function quickSort(l, asc){
    actions = [];
    step = 0;
    list = l;
    ascending = (asc === undefined) ? true : asc;

    // sort(0, list.length-1, Math.floor(Math.random()*list.length));
    sortSubarray(0, list.length-1, 3);
    return actions;
  };
});