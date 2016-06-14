'use strict';

/**
 * @ngdoc service
 * @name svgChartsApp.SvgChartsLineChart
 * @description
 * # SvgChartsLineChart
 * Factory in the svgChartsApp.
 */

/*global d3 */

angular.module('svgChartsApp')
  .factory('SvgChartsLineChart', function (SvgChartsScene) {

    var SvgChartsLineChart = {};
    
    SvgChartsLineChart.init = function() {
      this.gradient = SvgChartsScene.svgContent.append('svg:defs')
        .append('svg:linearGradient')
        .attr('id', 'gradient')
        .attr('x1', '100%')
        .attr('y1', '100%')
        .attr('x2', '100%')
        .attr('y2', '0%')
        .attr('name', 'linear-gradient')
        .attr('spreadMethod', 'pad');

      this.gradientStart = this.gradient.append('svg:stop')
        .attr('offset', '0%')
        .attr('stop-color', '#444')
        .attr('stop-opacity', 1);

      this.gradientStop = this.gradient.append('svg:stop')
        .attr('offset', '100%')
        .attr('stop-color', '#b8e1fc')
        .attr('stop-opacity', 1);


      SvgChartsLineChart.chartArea = SvgChartsScene.svgContent.append('path').attr('name', 'chartArea')
        .style('fill', 'url(#gradient)');

      SvgChartsLineChart.chartLine = SvgChartsScene.svgContent.append('path').attr('name', 'chartLine');
    };

    SvgChartsLineChart.cleanUp = function() {
      SvgChartsLineChart.chartArea.attr('d', function() {});
      SvgChartsLineChart.chartLine.attr('d', function() {});
    };

    SvgChartsLineChart.render = function () {

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

      SvgChartsLineChart.chartArea
        .datum(SvgChartsScene.chartData)
        .transition()
        .duration(500)
        .ease("linear")
        .attr("class", "area")
        .attr("d", area);

      SvgChartsLineChart.chartLine
        .datum(SvgChartsScene.chartData)
        .transition()
        .duration(500)
        .ease("linear")
        .attr('class', 'line')
        .attr('d', line)
        .attr('style', 'fill: none;stroke: steelblue;stroke-width: 1.5px;');
    };
    
    return SvgChartsLineChart;

  });
