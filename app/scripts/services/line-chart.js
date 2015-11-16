'use strict';

/**
 * @ngdoc service
 * @name svgChartsApp.LineChart
 * @description
 * # LineChart
 * Factory in the svgChartsApp.
 */
angular.module('svgChartsApp')
  .factory('LineChart', function (SvgChartsScene) {

    var LineChart = {};


    LineChart.init = function() {

      LineChart.gradient = SvgChartsScene.svgContent.append('svg:defs')
        .append('svg:linearGradient')
        .attr('id', 'gradient')
        .attr('x1', '100%')
        .attr('y1', '100%')
        .attr('x2', '100%')
        .attr('y2', '0%')
        .attr('spreadMethod', 'pad');

      LineChart.gradient.append('svg:stop')
        .attr('offset', '0%')
        .attr('stop-color', '#fff')
        .attr('stop-opacity', 1);

      LineChart.gradient.append('svg:stop')
        .attr('offset', '100%')
        .attr('stop-color', '#b8e1fc')
        .attr('stop-opacity', 1);


      LineChart.chartArea = SvgChartsScene.svgContent.append('path').attr('name', 'chartArea')
        .style('fill', 'url(#gradient)');

      LineChart.chartLine = SvgChartsScene.svgContent.append('path').attr('name', 'chartLine');
    };


    LineChart.cleanUp = function() {
      LineChart.chartArea.attr('d', function() {});
      LineChart.chartLine.attr('d', function() {});
    };


    LineChart.render = function () {

      var line = d3.svg.line()
        .x(function (d) {
          return SvgChartsScene.x(d.date);
        })
        .y(function (d) {
          return SvgChartsScene.y(d.close);
        });

      var area = d3.svg.area()
        .x(function(d) { return SvgChartsScene.x(d.date); })
        .y0(SvgChartsScene.height)
        .y1(function(d) { return SvgChartsScene.y(d.close); });

      LineChart.chartArea
        .datum(SvgChartsScene.chartData)
        .transition()
        .duration(500)
        .ease("linear")
        .attr("class", "area")
        .attr("d", area);

      LineChart.chartLine
        .datum(SvgChartsScene.chartData)
        .transition()
        .duration(500)
        .ease("linear")
        .attr('class', 'line')
        .attr('d', line)
        .attr('style', 'fill: none;stroke: steelblue;stroke-width: 1.5px;');
    };


    return LineChart;

  });
