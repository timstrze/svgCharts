'use strict';

/**
 * @ngdoc service
 * @name svgChartsApp.service:SvgChartsExtras
 * @description
 * # SvgChartsExtras
 * Factory that contains all the properties and methods for a SvgChartsExtras
 *
 */
angular.module('svgChartsApp')
  .factory('SvgChartsExtras', function (SvgChartsScene) {

    var SvgChartsExtras = {};

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
          return typeof each !== 'undefined'
        });
        // Transform the points into a basis line
        var pathDesc = d3.svg.line().interpolate('basis')(points);
        // Remove the extra 'M'
        return pathDesc.slice(1, pathDesc.length);
      }
    };

    SvgChartsExtras.movingAverageCleanup = function() {
      this.movingAvgLine.attr('d', function() {});
    };

    SvgChartsExtras.renderMovingAverage = function() {

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
        .x(function(d) { return SvgChartsScene.x(d.date); })
        .y0(function(d) { return SvgChartsScene.y(d.low); })
        .y1(function(d) { return SvgChartsScene.y(d.high); })
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

    SvgChartsExtras.bollingerBandsCleanup = function () {
      this.bollingerBandHigh.attr('d', function() {});
      this.bollingerBandLow.attr('d', function() {});
      this.bollingerBandArea.attr('d', function() {});
    };

    var getBollingerBands = function (n, k, data) {
      var bands = []; //{ ma: 0, low: 0, high: 0 }
      for (var i = n - 1, len = data.length; i < len; i++) {
        var slice = data.slice(i + 1 - n, i);
        var mean = d3.mean(slice, function (d) {
          return d.close;
        });
        var stdDev = Math.sqrt(d3.mean(slice.map(function (d) {
          return Math.pow(d.close - mean, 2);
        })));
        bands.push({
          date: data[i].date,
          ma: mean,
          low: mean - (k * stdDev),
          high: mean + (k * stdDev)
        });
      }
      return bands;
    };







    SvgChartsExtras.cleanUpDataPoints = function () {
      this.chartPlotPoints.selectAll('.data-points').remove();

    };

    SvgChartsExtras.renderDataPoints = function () {

      var dataPoints = this.chartPlotPoints.selectAll('.data-points')
          .data(SvgChartsScene.chartData);

      dataPoints.enter()
          .append('circle')
          .attr('name', function (d) {
            return d.Symbol
          })
          .on('click', function (d) {
            console.log(d);
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
        .attr('cx', function(d, i) {
          return SvgChartsScene.x(d.date);
        })
        .attr('cy', function (d) {
          return SvgChartsScene.y(d.close);
        })
        .attr('r', function(d) {
          return 4;
        });

    };



    return SvgChartsExtras;

  });
