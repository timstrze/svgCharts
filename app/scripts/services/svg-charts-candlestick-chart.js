'use strict';

/**
 * @ngdoc service
 * @name svgChartsApp.SvgChartsCandlestickChart
 * @description
 * # SvgChartsCandlestickChart
 * Factory in the svgChartsApp.
 */

/*global d3 */

angular.module('svgChartsApp')
  .factory('SvgChartsCandlestickChart', function (SvgChartsScene) {

    var SvgChartsCandlestickChart = {};

    SvgChartsCandlestickChart.init = function () {

      this.candleStickContainer = SvgChartsScene.svgContent.append('g')
        .attr('name', 'candleStickBars');
    };

    SvgChartsCandlestickChart.cleanUp = function () {

      if (this.bars) {
        this.bars.remove();
        this.bars.selectAll('.candlestick-rectangles').remove();
      }

    };

    var line = d3.svg.line()
      .x(function (d) {
        return d.x;
      })
      .y(function (d) {
        return d.y;
      });


    var isUpDay = function (d) {
      return d.close > d.open;
    };


    var applyCandlestick = function (bars) {

      var rect;
      var rectangleWidth = 3;

      rect = bars.selectAll('.candlestick-rectangles').data(function (d) {
        return [d];
      });

      rect.enter().append('rect')
        .classed('candlestick-rectangles', true);

      rect.exit().remove();

      rect
        .transition()
        .duration(500)
        .ease("linear")
        .attr('x', function (d) {
          return SvgChartsScene.x(d.date) - rectangleWidth;
        })
        .attr('y', function (d) {
          return isUpDay(d) ? SvgChartsScene.y(d.close) : SvgChartsScene.y(d.open);
        })
        .attr('width', rectangleWidth * 2)
        .attr('height', function (d) {
          return isUpDay(d) ? SvgChartsScene.y(d.open) - SvgChartsScene.y(d.close) : SvgChartsScene.y(d.close) - SvgChartsScene.y(d.open);
        });

    };

    SvgChartsCandlestickChart.render = function () {

      this.bars = this.candleStickContainer.selectAll('.candlestick-bar')
        .data(SvgChartsScene.chartData, function (d) {
          return d.date;
        });

      this.bars.enter()
        .append('g')
        .classed('candlestick-bar', true);

      this.bars.exit().remove();

      this.bars.attr({
        'fill': function (d) {
          return isUpDay(d) ? 'green' : 'red';
        }
      });

      var paths = this.bars.selectAll('.high-low-line').data(function (d) {
        return [d];
      });

      paths.enter().append('path')
        .classed('high-low-line', true);

      paths.exit().remove();

      paths.transition()
        .duration(500)
        .ease("linear")
        .attr('d', function (d) {
          return line([
            {x: SvgChartsScene.x(d.date), y: SvgChartsScene.y(d.high)},
            {x: SvgChartsScene.x(d.date), y: SvgChartsScene.y(d.low)}
          ]);
        })
        .attr({
          'stroke': function (d) {
            return isUpDay(d) ? 'green' : 'red';
          }
        });


      applyCandlestick(this.bars);

    };

    return SvgChartsCandlestickChart;

  });
