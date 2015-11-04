'use strict';

/**
 * @ngdoc service
 * @name svgChartsApp.LineChart
 * @description
 * # LineChart
 * Factory in the svgChartsApp.
 */
angular.module('svgChartsApp')
  .factory('LineChart', function () {

    var LineChart = {};

    LineChart.cleanUp = function() {
      if(LineChart.area) {
        LineChart.area.attr('d', function() {});
      }
      if(LineChart.chartLine) {
        LineChart.chartLine.attr('d', function() {});
      }
    };


    LineChart.render = function ($scope, historicalData) {

      if(!LineChart.chartLine) {
        LineChart.chartLine = $scope.chartLine;
      }

      if(!LineChart.area) {
        LineChart.area = $scope.chartArea;
      }


      var line = d3.svg.line()
        .x(function (d) {
          return $scope.x(d.date);
        })
        .y(function (d) {
          return $scope.y(d.close);
        });

      var area = d3.svg.area()
        .x(function(d) { return $scope.x(d.date); })
        .y0($scope.height)
        .y1(function(d) { return $scope.y(d.close); });

      LineChart.area
        .datum(historicalData)
        .transition()
        .duration(500)
        .ease("linear")
        .attr("class", "area")
        .attr("d", area);

      LineChart.chartLine
        .datum(historicalData)
        .transition()
        .duration(500)
        .ease("linear")
        .attr('class', 'line')
        .attr('d', line)
        .attr('style', 'fill: none;stroke: steelblue;stroke-width: 1.5px;');
    };

    return LineChart;

  });
