define(['svgController', 'util/constants'],
function(svgController,   constants){
    var actions;
    var list;
    var sortAscending;
    var step;

    var currentPrimary;
    var currentSecondary;

    function addAction(command, params){
      actions.push(svgController.createAction(step, command, params));
    }

    function deselect(index){
      addAction('setColor', {
        datum: list[index],
        color: constants.defaultColor
      });
    }

    function select(index, primary){
      var deselectPrev = (primary&&(currentPrimary!==undefined)) || (!primary&&(currentSecondary!==undefined));
      if(deselectPrev){
        deselect(primary?currentPrimary:currentSecondary);
      }

      addAction('setColor', {
        datum: list[index],
        color: primary?constants.bubblesort.primaryColor:constants.bubblesort.secondaryColor
      });

      if(primary){
        currentPrimary = index;
      } else {
        currentSecondary = index;
      }
    }

    function swap(primary, secondary){
      addAction('swapColorAndPosition', [list[primary], list[secondary]]);
    }

    // TODO: don't need both init+sort
    function init(data){
        actions = [];
        step = 0;
        list = data.list.slice();
        sortAscending = (data.sortAscending === undefined) ? true : data.sortAscending;
        return this;
    }

    function sort(){
        var outer;
        var inner;
        var outerMax;
        var innerMax;
        for(outer=0, outerMax=list.length-2; outer<=outerMax; outer++){
            select(outer, true);
            for(inner=outer+1, innerMax=list.length-1; inner<=innerMax; inner++){
                select(inner, false);
                step++
                var outOfOrder = (sortAscending && list[outer]>list[inner]) || (!sortAscending && list[outer]<list[inner]);
                if(outOfOrder){
                    var tmp = list[outer];
                    list[outer] = list[inner];
                    list[inner] = tmp;
                    swap(outer, inner);
                    step++;
                }
            }
        }
        deselect(outerMax);
        deselect(innerMax);
        return actions;
    }

    return {
        init: init,
        sort: sort
    };
});