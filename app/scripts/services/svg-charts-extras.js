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
      SvgChartsExtras.bollingerBandArea = SvgChartsScene.svgContent.append('svg:path')
        .attr('class', 'bollinger-band-area')
        .attr('style', 'fill: grey;').attr('fill-opacity', 0.2);

      SvgChartsExtras.bollingerBandHigh = SvgChartsScene.svgContent.append('svg:path')
        .attr('class', 'band bollinger-band-high')
        .attr('style', 'stroke: black; fill: none;');

      SvgChartsExtras.bollingerBandLow = SvgChartsScene.svgContent.append('svg:path')
        .attr('class', 'band bollinger-band-low')
        .attr('style', 'stroke: black; fill: none;');

      SvgChartsExtras.movingAvgLine = SvgChartsScene.svgContent.append('svg:path')
        .attr('class', 'moving-average')
        .attr('style', 'stroke: #FF9900; fill: none;');
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

    SvgChartsExtras.renderMovingAverage = function() {

      //var _movingSum;
      var movingAverageLine = d3.svg.line()
        .x(function (d, i) {
          return SvgChartsScene.x(d.date);
        })
        .y(function (d, i) {
          return SvgChartsScene.y(d.close);
        })
        .interpolate(movingAvg(3));

      SvgChartsScene.movingAvgLine
        .transition()
        .duration(500)
        .ease("linear")
        .attr('d', movingAverageLine(SvgChartsScene.chartData));
    };

    SvgChartsExtras.renderBollingerBands = function () {

      //var _movingSum;
      var bollingerBandLow = d3.svg.line()
        .x(function (d, i) {
          return SvgChartsScene.x(d.date);
        })
        .y(function (d, i) {
          return SvgChartsScene.y(d.Low);
        })
        .interpolate(movingAvg(3));


      var bollingerBandArea = d3.svg.area()
        .x(function(d) { return SvgChartsScene.x(d.date); })
        .y0(function(d) { return SvgChartsScene.y(d.Low); })
        .y1(function(d) { return SvgChartsScene.y(d.High); })
        .interpolate(movingAvg(3));

      //var _movingSum;
      var bollingerBandHigh = d3.svg.line()
        .x(function (d, i) {
          return $scope.x(d.date);
        })
        .y(function (d, i) {
          return $scope.y(d.High);
        })
        .interpolate(movingAvg(3));

      $scope.bollingerBandLow
        .transition()
        .duration(500)
        .ease("linear")
        .attr('d', bollingerBandLow($scope.symbol.historicalData));

      $scope.bollingerBandHigh
        .transition()
        .duration(500)
        .ease("linear")
        .attr('d', bollingerBandHigh($scope.symbol.historicalData));

      $scope.bollingerBandArea
        .transition()
        .duration(500)
        .ease("linear")
        .attr('d', bollingerBandArea($scope.symbol.historicalData));
    };

    SvgChartsExtras.getBollingerBands = function (n, k, data) {
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

    SvgChartsExtras.renderDataPoints = function () {
      //var positions;
      //
      //// Loop over the Positions
      //angular.forEach($scope.positions, function (position) {
      //  // Check to see if Symbols match
      //  if (position.Symbol.Symbol.toLowerCase() === $scope.symbol.Symbol.toLowerCase()) {
      //    positions = position;
      //  }
      //});

      //if(positions) {
      //  var x = d3.time.scale()
      //    .range([0, $scope.width]);
      //
      //  var y = d3.scale.linear()
      //    .range([$scope.height, 0]);
      //
      //  //var g = $scope.svg.append('g');
      //  //
      //  //var img = g.append('svg:image')
      //  //  .attr('xlink:href', './images/icons/buy.svg')
      //  //  .attr('width', 50)
      //  //  .attr('height', 50)
      //  //  .attr('x', 228)
      //  //  .attr('y',53);
      //
      //
      //  $scope.svgContent.selectAll('circle').remove();
      //  $scope.svgContent.selectAll('circle')
      //    .data(positions.buys)
      //    .enter()
      //    .append('circle')
      //    .attr('cx', function(d, i) {
      //      return x($scope.parseDate(d.created.split(' ')[0]));
      //    })
      //    .attr('cy', function (d) {
      //      return y(d.ask);
      //    })
      //
      //    .attr('r', function(d) {
      //      return 10;
      //    })
      //    .attr('fill', '#3F51B5')
      //    .attr('stroke', '#fff');
      //
      //  //$scope.svg.selectAll('text').remove();
      //  //$scope.svg.selectAll('text')
      //  //  .data(positions.buys)
      //  //  .enter()
      //  //  .append('text')
      //  //  .attr('x', function(d, i) {
      //  //    return x($scope.parseDate(d.created.split(' ')[0]));
      //  //  })
      //  //  .attr('y', function (d) {
      //  //    return y(d.ask);
      //  //  })
      //  //  .text(function(d) {
      //  //    return d.ask;
      //  //  });
      //
      //}else{
      //  //$scope.svg.selectAll('text').remove();
      //  $scope.svgContent.selectAll('circle').remove()
      //}
    };



    return SvgChartsExtras;

  });
