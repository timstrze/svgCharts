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

    OHLCChart.cleanUp = function() {
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

    var wrap = function(text, width, popoverTextBoxX) {
      text.each(function() {
        var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", popoverTextBoxX + 3).attr("y", parseInt(y) + 20).attr("dy", 0 + "em");
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", popoverTextBoxX + 3).attr("y", parseInt(y) + 20).attr("dy", ++lineNumber + "em").text(word);
          }
        }
      });
    };

    var isUpDay = function(d) {
      return d.close > d.Open;
    };

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

      var rect;
      var rectangleWidth = 3;
      var popoverTextBoxWidth = 135;
      var popoverTextBoxHeight = 120;
      var popoverTextBoxX;
      var popoverTextBoxY;


      rect = bars.selectAll('rect').data(function (d) {
        return [d];
      });

      rect.enter().append('rect');

      rect
        .on('click', function(d) {
          var m = d3.mouse($scope.svg.node());

          popoverTextBoxX = m[0];
          popoverTextBoxY = m[1];

          if($scope.popoverText || $scope.popoverTextBox) {
            $scope.popoverText.remove();
            $scope.popoverTextBox.remove();
          }

          if(popoverTextBoxY + popoverTextBoxHeight > $scope.height) {
            popoverTextBoxY = popoverTextBoxY - popoverTextBoxHeight;
          }

          if(popoverTextBoxX + popoverTextBoxWidth > $scope.width) {
            popoverTextBoxX = popoverTextBoxX - popoverTextBoxWidth;
          }

          $scope.popoverTextBox = $scope.svg.append('rect')
            .attr("x", popoverTextBoxX)
            .attr("y", popoverTextBoxY)
            .attr("rx", 6)
            .attr("ry", 6)
            .attr("width", popoverTextBoxWidth)
            .attr("height", popoverTextBoxHeight)
            .attr("fill", "rgba(0,0,0,0.34)")
            .attr({
              'stroke': 'black',
              'stroke-width': '1px'
            });


          $scope.popoverText = $scope.svg.append('text')
            .attr("x", popoverTextBoxX)
            .attr("y", popoverTextBoxY)
            .attr('class', 'popover-text')
            .attr('name', 'popover-text')
            .text( function () {
              return  d.Date +
                ' O:' + d.Open +
                ' H:' + d.High +
                ' L:' + d.Low +
                ' C:' + d.Close; })
            .attr("font-family", "sans-serif")
            .attr("font-size", "20px")
            .attr("fill", "white")
            .call(wrap, 125, popoverTextBoxX);
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
        .attr('style', 'cursor:pointer;')
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
