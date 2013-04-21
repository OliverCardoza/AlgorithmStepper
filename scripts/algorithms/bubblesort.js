define(function(){
    var list;
    var sortAscending;

    function init(data){
        list = data.list;
        sortAscending = (data.sortAscending === undefined) ? true : data.sortAscending;
        alert(list);
    }

    function sort(){
        var outer;
        var inner;
        var outerMax;
        var innerMax;
        for(outer=0, outerMax=list.length-2; outer<=outerMax; outer++){
            for(inner=outer+1, innerMax=list.length-1; inner<=innerMax; inner++){
                var outOfOrder = (sortAscending && list[outer]>list[inner]) || (!sortAscending && list[outer]<list[inner]);
                if(outOfOrder){
                    var tmp = list[outer];
                    list[outer] = list[inner];
                    list[inner] = tmp;
                }
            }
        }
        alert(list);
    }

    return {
        init: init,
        sort: sort
    };
});