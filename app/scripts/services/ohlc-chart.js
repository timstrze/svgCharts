'use strict';

/**
 * @ngdoc service
 * @name svgChartsApp.OHLCChart
 * @description
 * # OHLCChart
 * Factory in the svgChartsApp.
 */
angular.module('svgChartsApp')
  .factory('OHLCChart', function () {

    var OHLCChart = {};



    OHLCChart.cleanUp = function($scope) {
      //OHLCChart.area.remove();
      if(OHLCChart.bars && OHLCChart.bars.selectAll('.bar')) {
        var bars = OHLCChart.bars.selectAll('.bar');
        bars.selectAll('.high-low-line').attr('d', function() {});
        bars.selectAll('.open-tick').attr('d', function() {});
        bars.selectAll('.close-tick').attr('d', function() {});
        bars.selectAll('rect').remove();
      }
    };

    var line = d3.svg.line()
      .x(function (d) {
        return d.x;
      })
      .y(function (d) {
        return d.y;
      });

    var isUpDay = function(d) {
      return d.close > d.Open;
    };
    //
    //var isDownDay = function (d) {
    //  return d.Open > d.close;
    //};

    var applyOHLC = function ($scope, bars) {

      var open,
        close,
        tickWidth = 5;

      open = bars.selectAll('.open-tick').data(function (d) {
        return [d];
      });

      close = bars.selectAll('.close-tick').data(function (d) {
        return [d];
      });

      open.enter().append('path');
      close.enter().append('path');

      open.classed('open-tick', true)
        .transition()
        .duration(500)
        .ease("linear")
        .attr('d', function (d) {
          return line([
            {x: $scope.x(d.date) - tickWidth, y: $scope.y(d.Open)},
            {x: $scope.x(d.date), y: $scope.y(d.Open)}
          ]);
        })
        .attr({
          'stroke': function(d) {
            return  isUpDay(d) ? 'green' : 'red';
          }
        });

      close.classed('close-tick', true)
        .transition()
        .duration(500)
        .ease("linear")
        .attr('d', function (d) {
          return line([
            {x: $scope.x(d.date), y: $scope.y(d.close)},
            {x: $scope.x(d.date) + tickWidth, y: $scope.y(d.close)}
          ]);
        })
        .attr({
          'stroke': function(d) {
            return  isUpDay(d) ? 'green' : 'red';
          }
        });

    };

    var applyCandlestick = function ($scope, bars) {

      var rect,
        rectangleWidth = 3;

      rect = bars.selectAll('rect').data(function (d) {
        return [d];
      });

      rect.enter().append('rect');

      rect
        .on('click', function(d) {
          var m = d3.mouse($scope.svg.node());

          if($scope.popoverText) {
            $scope.popoverText.remove();
          }

          $scope.popoverText = $scope.svg.append('text')
            .attr("x", m[0])
            .attr("y", m[1])
            .attr('class', 'popover-text')
            .attr('name', 'popover-text')
            .text( function () {
              return  'Date: ' + d.Date +
                ' Open: ' + d.Open +
                ' High: ' + d.High +
                ' Low: ' + d.Low +
                ' Close: ' + d.Close; })
            .attr("font-family", "sans-serif")
            .attr("font-size", "20px")
            .attr("fill", "black");
        });

      rect
        .transition()
        .duration(500)
        .ease("linear")
        .attr('x', function (d) {
          return $scope.x(d.date) - rectangleWidth;
        })
        .attr('y', function (d) {
          return isUpDay(d) ? $scope.y(d.close) : $scope.y(d.Open);
        })
        .attr('width', rectangleWidth * 2)
        .attr('height', function (d) {
          return isUpDay(d)
            ? $scope.y(d.Open) - $scope.y(d.close)
            : $scope.y(d.close) - $scope.y(d.Open);
        });

    };

    OHLCChart.render = function ($scope, historicalData, isCandlestick) {


      //if(!OHLCChart.bars) {
        OHLCChart.bars = $scope.svgContent;
      //}

      var bars = $scope.svgContent.selectAll('.bar')
        .data(historicalData, function (d) {
          return d.date;
        });

      bars.enter()
        .append('g')
        .classed('bar', true);

      bars.attr({
        'fill': function(d) {
          return  isUpDay(d) ? 'green' : 'red';
        }
      });

      var paths = bars.selectAll('.high-low-line').data(function (d) {
        return [d];
      });

      paths.enter().append('path');

      paths.classed('high-low-line', true)
        .transition()
        .duration(500)
        .ease("linear")
        .attr('d', function (d) {
          return line([
            { x: $scope.x(d.date), y: $scope.y(d.High) },
            { x: $scope.x(d.date), y: $scope.y(d.Low) }
          ]);
        })
        .attr({
          'stroke': function(d) {
            return  isUpDay(d) ? 'green' : 'red';
          }
        });

      if(isCandlestick) {
        applyCandlestick($scope, bars);
      }else{
        applyOHLC($scope, bars);
      }

    };



    return OHLCChart;

  });
