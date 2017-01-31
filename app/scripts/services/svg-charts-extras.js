'use strict';

/**
 * @ngdoc service
 * @name svgChartsApp.service:SvgChartsExtras
 * @description
 * # SvgChartsExtras
 * Factory that contains all the properties and methods for a SvgChartsExtras
 *
 */

/*global d3 */

angular.module('svgChartsApp')
  .factory('SvgChartsExtras', function (SvgChartsScene, SvgChartsPopover) {

    var SvgChartsExtras = {};


    /**
     * @ngdoc function
     * @name movingAvg
     * @methodOf svgChartsApp.service:SvgChartsExtras
     *
     * @description
     * Render svg items
     *
     */
    var movingAvg = function (n) {
      return function (points) {
        points = points.map(function (each, index, array) {
          var to = index + n - 1;
          var subSeq, sum;
          if (to < points.length) {
            subSeq = array.slice(index, to + 1);
            sum = subSeq.reduce(function (a, b) {
              return [a[0] + b[0], a[1] + b[1]];
            });
            return sum.map(function (each) {
              return each / n;
            });
          }
          return undefined;
        });
        points = points.filter(function (each) {
          return typeof each !== 'undefined';
        });
        // Transform the points into a basis line
        var pathDesc = d3.svg.line().interpolate('basis')(points);
        // Remove the extra 'M'
        return pathDesc.slice(1, pathDesc.length);
      };
    };


    /**
     * @ngdoc function
     * @name SvgChartsExtras.cleanUp
     * @methodOf svgChartsApp.service:SvgChartsExtras
     *
     * @description
     * Render svg items
     *
     */
    SvgChartsExtras.init = function () {
      this.bollingerBandArea = SvgChartsScene.svgContent.append('svg:path')
        .attr('class', 'bollinger-band-area')
        .attr('style', 'fill: grey;').attr('fill-opacity', 0.2);

      this.bollingerBandHigh = SvgChartsScene.svgContent.append('svg:path')
        .attr('class', 'band bollinger-band-high')
        .attr('style', 'stroke: black; fill: none;');

      this.bollingerBandLow = SvgChartsScene.svgContent.append('svg:path')
        .attr('class', 'band bollinger-band-low')
        .attr('style', 'stroke: black; fill: none;');

      this.movingAvgLine = SvgChartsScene.svgContent.append('svg:path')
        .attr('class', 'moving-average')
        .attr('style', 'stroke: #FF9900; fill: none;');

      this.chartPlotPoints = SvgChartsScene.svgContent.append('g')
        .attr('name', 'chartPlotPoints');

    };



    /**
     * @ngdoc function
     * @name SvgChartsExtras.movingAverageCleanup
     * @methodOf svgChartsApp.service:SvgChartsExtras
     *
     * @description
     * Render svg items
     *
     */
    SvgChartsExtras.movingAverageCleanup = function () {
      this.movingAvgLine.attr('d', function () {
      });
    };


    /**
     * @ngdoc function
     * @name SvgChartsExtras.renderMovingAverage
     * @methodOf svgChartsApp.service:SvgChartsExtras
     *
     * @description
     * Render svg items
     *
     */
    SvgChartsExtras.renderMovingAverage = function () {

      var movingAverageLine = d3.svg.line()
        .x(function (d) {
          return SvgChartsScene.x(d.date);
        })
        .y(function (d) {
          return SvgChartsScene.y(d.close);
        })
        .interpolate(movingAvg(3));

      this.movingAvgLine
        .transition()
        .duration(500)
        .ease("linear")
        .attr('d', movingAverageLine(SvgChartsScene.chartData));
    };


    /**
     * @ngdoc function
     * @name SvgChartsExtras.renderBollingerBands
     * @methodOf svgChartsApp.service:SvgChartsExtras
     *
     * @description
     * Render svg items
     *
     */
    SvgChartsExtras.renderBollingerBands = function () {
      //var _movingSum;
      var bollingerBandLow = d3.svg.line()
        .x(function (d) {
          return SvgChartsScene.x(d.date);
        })
        .y(function (d) {
          return SvgChartsScene.y(d.low);
        })
        .interpolate(movingAvg(3));


      var bollingerBandArea = d3.svg.area()
        .x(function (d) {
          return SvgChartsScene.x(d.date);
        })
        .y0(function (d) {
          return SvgChartsScene.y(d.low);
        })
        .y1(function (d) {
          return SvgChartsScene.y(d.high);
        })
        .interpolate(movingAvg(3));

      var bollingerBandHigh = d3.svg.line()
        .x(function (d) {
          return SvgChartsScene.x(d.date);
        })
        .y(function (d) {
          return SvgChartsScene.y(d.high);
        })
        .interpolate(movingAvg(3));

      this.bollingerBandLow
        .transition()
        .duration(500)
        .ease("linear")
        .attr('d', bollingerBandLow(SvgChartsScene.chartData));

      this.bollingerBandHigh
        .transition()
        .duration(500)
        .ease("linear")
        .attr('d', bollingerBandHigh(SvgChartsScene.chartData));

      this.bollingerBandArea
        .transition()
        .duration(500)
        .ease("linear")
        .attr('d', bollingerBandArea(SvgChartsScene.chartData));
    };


    /**
     * @ngdoc function
     * @name SvgChartsExtras.bollingerBandsCleanup
     * @methodOf svgChartsApp.service:SvgChartsExtras
     *
     * @description
     * Render svg items
     *
     */
    SvgChartsExtras.bollingerBandsCleanup = function () {
      // Remove the bollinger bands high
      this.bollingerBandHigh.attr('d', function () {});
      // Remove the bollinger bands high
      this.bollingerBandLow.attr('d', function () {});
      // Remove the bollinger bands area
      this.bollingerBandArea.attr('d', function () {});
    };


    /**
     * @ngdoc function
     * @name SvgChartsExtras.cleanUpDataPoints
     * @methodOf svgChartsApp.service:SvgChartsExtras
     *
     * @description
     * Render svg items
     *
     */
    SvgChartsExtras.cleanUpDataPoints = function () {
      this.chartPlotPoints.selectAll('.data-points').remove();
    };


    /**
     * @ngdoc function
     * @name SvgChartsExtras.renderDataPoints
     * @methodOf svgChartsApp.service:SvgChartsExtras
     *
     * @description
     * Render data points
     *
     */
    SvgChartsExtras.renderDataPoints = function () {

      var dataPoints = this.chartPlotPoints.selectAll('.data-points')
        .data(SvgChartsScene.chartData);

      dataPoints.enter()
        .append('circle')
        .attr('name', function (d) {
          return d.Symbol;
        })
        .on('click', function (d) {
          console.log(d);
          SvgChartsPopover.open(d);
        })
        .attr('style', 'cursor: pointer;')
        .attr('class', 'data-points')
        .attr('fill', '#3F51B5')
        .attr('stroke', '#fff');

      dataPoints.exit().remove();

      dataPoints
        .transition()
        .duration(500)
        .ease("linear")
        .attr('cx', function (d) {
          return SvgChartsScene.x(d.date);
        })
        .attr('cy', function (d) {
          return SvgChartsScene.y(d.close);
        })
        .attr('r', function () {
          return 4;
        });

    };

    return SvgChartsExtras;

  });
