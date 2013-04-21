requirejs(['./algorithms/bubblesort'], function(bs){
    var list = [2, 6, 1, 5, 9, 3];
    bs.init({list: list});
    bs.sort();
});