requirejs(['./algorithms/bubblesort', './lib/d3', './lib/underscore', './util/actionHelper', './util/constants'],
function(   bs,                        d3,         _,                  actionHelper,          constants) {
    var data = [20, 60, 10, 50, 90, 30];

    bs.init({list: data});
    var actions = bs.sort();

    var svg = d3.select('svg');
    var scalingFactor = (svg.attr('width')-100)/_.max(data);
    svg.selectAll("circle")
        .data(data)
      .enter().append("circle")
        .attr("cy", 150)
        .attr("cx", function(val, i){
          //return Math.ceil(val*scalingFactor);
          return ((svg.attr('width')-100)/data.length)*i+50;
        })
        .attr("r", function(val){
          return val*0.5;
        })
        .attr("id", function(val){
          return "circle-" + val;
        });

    var step = 0;
    while(actions.length){
      var continu = true;
      while(continu){
        (function a(){
          var action = actions.splice(0, 1)[0];
          continu = action.continues;
          setTimeout(function(){
            if(action.type === 'primarySelect'){
              actionHelper.select('#circle-'+action.value);
            } else if(action.type === 'secondarySelect') {
              actionHelper.select('#circle-'+action.value, null, true);
            } else if(action.type === 'swap'){
              actionHelper.swap('#circle-'+action.value[0], '#circle-'+action.value[1]);
            } else if(action.type === 'deselect'){
              actionHelper.deselect('#circle-'+action.value);
            }
          }, step*constants.stepInterval);
        })();
      }
      step++;
    }
    window.d3 = d3;
});