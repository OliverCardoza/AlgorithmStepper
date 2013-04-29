define(['svgController'],
function(svgController){
    var list;
    var sortAscending;

    // TODO: change to constructor
    function init(data){
        list = data.list.slice();
        sortAscending = (data.sortAscending === undefined) ? true : data.sortAscending;
        return this;
    }

    function sort(){
        var outer;
        var inner;
        var outerMax;
        var innerMax;
        var actions = [];
        for(outer=0, outerMax=list.length-2; outer<=outerMax; outer++){
            actions.push(svgController.createAction('primarySelect', list[outer], true));
            for(inner=outer+1, innerMax=list.length-1; inner<=innerMax; inner++){
                actions.push(svgController.createAction('secondarySelect', list[inner]));
                var outOfOrder = (sortAscending && list[outer]>list[inner]) || (!sortAscending && list[outer]<list[inner]);
                if(outOfOrder){
                    var tmp = list[outer];
                    list[outer] = list[inner];
                    list[inner] = tmp;
                    actions.push(svgController.createAction('swap', [list[outer], list[inner]]));
                }
            }
        }
        actions.push(svgController.createAction('deselect', list[outerMax], true));
        actions.push(svgController.createAction('deselect', list[innerMax]));
        return actions;
    }

    return {
        init: init,
        sort: sort
    };
});