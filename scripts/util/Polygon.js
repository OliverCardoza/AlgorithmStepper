define(function(){
  return function Polygon(points){
    var points = points;

    this.toString = function(){
      return points.map(function(point){
        return [point.x, point.y].join(',');
      }).join(' ');
    };
  };
});