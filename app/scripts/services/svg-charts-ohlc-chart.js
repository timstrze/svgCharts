'use strict';

/**
 * @ngdoc service
 * @name svgChartsApp.SvgChartsOHLCChart
 * @description
 * # SvgChartsOHLCChart
 * Factory in the svgChartsApp.
 */

/*global d3 */

angular.module('svgChartsApp')
  .factory('SvgChartsOHLCChart', function (SvgChartsScene) {

    var SvgChartsOHLCChart = {};

    SvgChartsOHLCChart.init = function() {

      this.ohlcContainer = SvgChartsScene.svgContent.append('g')
        .attr('name', 'ohlcBars');

    };


    var line = d3.svg.line()
      .x(function (d) {
        return d.x;
      })
      .y(function (d) {
        return d.y;
      });

    SvgChartsOHLCChart.cleanUp = function() {

      if(this.bars) {
        this.bars.remove();
        this.bars.selectAll('.high-low-line').remove();
        this.bars.selectAll('.open-tick').remove();
        this.bars.selectAll('.close-tick').remove();
      }

    };



    var isUpDay = function(d) {
      return d.close > d.open;
    };

    var applyOHLC = function (bars) {

      var tickWidth = 5;

      var open = bars.selectAll('.open-tick').data(function (d) {
        return [d];
      });

      var close = bars.selectAll('.close-tick').data(function (d) {
        return [d];
      });

      open.enter().append('path').classed('open-tick', true);

      open.exit().remove();

      close.enter().append('path').classed('close-tick', true);

      close.exit().remove();

      open.transition()
        .duration(500)
        .ease("linear")
        .attr('d', function (d) {
          return line([
            {x: SvgChartsScene.x(d.date) - tickWidth, y: SvgChartsScene.y(d.open)},
            {x: SvgChartsScene.x(d.date), y: SvgChartsScene.y(d.open)}
          ]);
        })
        .attr({
          'stroke': function(d) {
            return  isUpDay(d) ? 'green' : 'red';
          }
        });

      close.transition()
        .duration(500)
        .ease("linear")
        .attr('d', function (d) {
          return line([
            {x: SvgChartsScene.x(d.date), y: SvgChartsScene.y(d.close)},
            {x: SvgChartsScene.x(d.date) + tickWidth, y: SvgChartsScene.y(d.close)}
          ]);
        })
        .attr({
          'stroke': function(d) {
            return  isUpDay(d) ? 'green' : 'red';
          }
        });

    };



    SvgChartsOHLCChart.render = function () {

      this.bars = this.ohlcContainer.selectAll('.ohlc-bar')
        .data(SvgChartsScene.chartData, function (d) {
          return d.date;
        });

      this.bars.enter()
        .append('g')
        .classed('ohlc-bar', true);

      this.bars.exit().remove();

      this.bars.attr({
        'fill': function(d) {
          return  isUpDay(d) ? 'green' : 'red';
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
            { x: SvgChartsScene.x(d.date), y: SvgChartsScene.y(d.high) },
            { x: SvgChartsScene.x(d.date), y: SvgChartsScene.y(d.low) }
          ]);
        })
        .attr({
          'stroke': function(d) {
            return  isUpDay(d) ? 'green' : 'red';
          }
        });


        applyOHLC(this.bars);


    };

    return SvgChartsOHLCChart;

  });
