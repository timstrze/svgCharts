'use strict';

/**
 * @ngdoc service
 * @name svgChartsApp.service:svgChartsPopover
 * @description
 * # svgChartsPopover
 * Factory that contains all the properties and methods for a svgChartsPopover
 *
 */
angular.module('svgChartsApp')
  .factory('SvgChartsPopover', function (SvgChartsScene) {

    var SvgChartsPopover = {};

    SvgChartsPopover.open = function(_d) {

      var popoverTextBoxWidth = 135;
      var popoverTextBoxHeight = 120;
      var popoverTextBoxX;
      var popoverTextBoxY;

        var m = d3.mouse(SvgChartsScene.svg.node());

        popoverTextBoxX = m[0];
        popoverTextBoxY = m[1];

        if(popoverTextBoxY + popoverTextBoxHeight > SvgChartsScene.height) {
          popoverTextBoxY = popoverTextBoxY - popoverTextBoxHeight;
        }

        if(popoverTextBoxX + popoverTextBoxWidth > SvgChartsScene.width) {
          popoverTextBoxX = popoverTextBoxX - popoverTextBoxWidth;
        }

        SvgChartsScene.popoverTextBox
          .attr('x', popoverTextBoxX)
          .attr('y', popoverTextBoxY)
          .attr('rx', 6)
          .attr('ry', 6)
          .attr('width', popoverTextBoxWidth)
          .attr('height', popoverTextBoxHeight)
          .attr('fill', 'rgba(0,0,0,0.34)')
          .attr({
            'stroke': 'black',
            'stroke-width': '1px'
          });

        SvgChartsScene.popoverText
          .attr('x', popoverTextBoxX)
          .attr('y', popoverTextBoxY + 12)
          .attr('class', 'popover-text')
          .attr('name', 'popover-text')
          .text( function () {
            return  _d.date.getMonth() + '/' + _d.date.getDay() + '/' + _d.date.getFullYear() +
              ' O: ' + parseFloat(Math.round(_d.open * 100) / 100).toFixed(2) +
              ' H: ' + parseFloat(Math.round(_d.high * 100) / 100).toFixed(2) +
              ' L: ' + parseFloat(Math.round(_d.low * 100) / 100).toFixed(2) +
              ' C: ' + parseFloat(Math.round(_d.close * 100) / 100).toFixed(2); })
          .attr('font-family', 'sans-serif')
          .attr('font-size', '20px')
          .attr('fill', 'white')
          .call(wrap, 90, popoverTextBoxX + 4);

        SvgChartsScene.popoverTextBoxCloseText
          .attr('x', popoverTextBoxX + popoverTextBoxWidth - 20 + 5)
          .attr('y', popoverTextBoxY + 20 - 4)
          .text('X');

        SvgChartsScene.popoverTextBoxClose
          .attr('x', popoverTextBoxX + popoverTextBoxWidth - 20 + 2)
          .attr('y', popoverTextBoxY + 2)
          .attr('rx', 6)
          .attr('ry', 6)
          .attr('width', 16)
          .attr('height', 16)
          .attr('fill', 'red')
          .attr({
            'stroke': 'black',
            'stroke-width': '1px'
          })
          .attr('style', 'fill-opacity:0.3; cursor: pointer;')
          .on('click', function() {
            SvgChartsPopover.cleanUpPopovers();
          });
    };


    SvgChartsPopover.cleanUpPopovers = function() {

      if(SvgChartsScene.$previousChartData && (angular.equals(SvgChartsScene.$previousChartData[0], SvgChartsScene.chartData[0]))) {
        SvgChartsScene.$previousChartData = SvgChartsScene.chartData;
        return false;
      }

      SvgChartsScene.popoverTextBox.attr('x', -500);
      SvgChartsScene.popoverTextBoxClose.attr('x', -500);

      SvgChartsScene.popoverText.text('');
      SvgChartsScene.popoverTextBoxCloseText.text('');

      SvgChartsScene.$previousChartData = SvgChartsScene.chartData;

    };


    var wrap = function(text, width, popoverTextBoxX) {
      text.each(function() {
        var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr('y'),
          dy = parseFloat(text.attr('dy')),
          tspan = text.text(null).append('tspan').attr('x', popoverTextBoxX + 3).attr('y', parseInt(y) + 20).attr('dy', 0 + 'em');
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(' '));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(' '));
            line = [word];
            tspan = text.append('tspan').attr('x', popoverTextBoxX + 3).attr('y', parseInt(y) + 20).attr('dy', ++lineNumber + 'em').text(word);
          }
        }
      });
    };

    /**
     * @ngdoc function
     * @name svgChartsPopover.init
     * @methodOf svgChartsApp.service:svgChartsPopover
     *
     * @description
     * Initiate the popover svg elements
     *
     */
    SvgChartsPopover.init = function() {
      SvgChartsScene.popoverTextBox = SvgChartsScene.svg.append('rect');
      SvgChartsScene.popoverText = SvgChartsScene.svg.append('text');
      SvgChartsScene.popoverTextBoxCloseText = SvgChartsScene.svg.append('text');
      SvgChartsScene.popoverTextBoxClose = SvgChartsScene.svg.append('rect');
    };

    return SvgChartsPopover;

  });
