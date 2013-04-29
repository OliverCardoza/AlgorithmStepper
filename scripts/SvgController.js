define(['lib/d3'],
function(d3){
  // TODO: make a Singleton
  return function SvgController(){
    var svg = d3.select('svg');
    var scalingFactor;

    this.clear = function(){
      svg.selectAll('circle').remove();
    };

    this.init = function(data){
      scalingFactor = (svg.attr('width')-100)/data.length;
      
      svg.selectAll("circle")
          .data(data)
        .enter().append("circle")
          .attr("cy", svg.attr('height')/2)
          .attr("cx", function(val, i){
            return scalingFactor*i+50;
          })
          .attr("r", function(val){
            return val*0.5;
          })
          .attr("id", function(val){
            return "circle-" + val;
          });
    }
  };
});