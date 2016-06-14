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
  .factory('SvgChartsPopover', function () {

    var SvgChartsPopover = {};

    // SvgChartsPopover.test = function(rect) {
    //
    //   var popoverTextBoxWidth = 135;
    //   var popoverTextBoxHeight = 120;
    //   var popoverTextBoxX;
    //   var popoverTextBoxY;
    //
    //   rect
    //     .on('click', function(d) {
    //       var m = d3.mouse($scope.svg.node());
    //
    //       popoverTextBoxX = m[0];
    //       popoverTextBoxY = m[1];
    //
    //       if($scope.popoverText || $scope.popoverTextBox) {
    //         cleanUpPopovers();
    //       }
    //
    //       if(popoverTextBoxY + popoverTextBoxHeight > $scope.height) {
    //         popoverTextBoxY = popoverTextBoxY - popoverTextBoxHeight;
    //       }
    //
    //       if(popoverTextBoxX + popoverTextBoxWidth > $scope.width) {
    //         popoverTextBoxX = popoverTextBoxX - popoverTextBoxWidth;
    //       }
    //
    //       $scope.popoverTextBox = $scope.svg.append('rect')
    //         .attr("x", popoverTextBoxX)
    //         .attr("y", popoverTextBoxY)
    //         .attr("rx", 6)
    //         .attr("ry", 6)
    //         .attr("width", popoverTextBoxWidth)
    //         .attr("height", popoverTextBoxHeight)
    //         .attr("fill", "rgba(0,0,0,0.34)")
    //         .attr({
    //           'stroke': 'black',
    //           'stroke-width': '1px'
    //         });
    //
    //       $scope.popoverText = $scope.svg.append('text')
    //         .attr("x", popoverTextBoxX)
    //         .attr("y", popoverTextBoxY)
    //         .attr('class', 'popover-text')
    //         .attr('name', 'popover-text')
    //         .text( function () {
    //           return  d.Date +
    //             ' O:' + d.Open +
    //             ' H:' + d.High +
    //             ' L:' + d.Low +
    //             ' C:' + d.Close; })
    //         .attr("font-family", "sans-serif")
    //         .attr("font-size", "20px")
    //         .attr("fill", "white")
    //         .call(wrap, 125, popoverTextBoxX);
    //
    //       $scope.popoverTextBoxCloseText = $scope.svg.append('text')
    //         .attr("x", popoverTextBoxX + popoverTextBoxWidth - 20 + 5)
    //         .attr("y", popoverTextBoxY + 20 - 4)
    //         .text('X');
    //
    //       $scope.popoverTextBoxClose = $scope.svg.append('rect')
    //         .attr("x", popoverTextBoxX + popoverTextBoxWidth - 20 + 2)
    //         .attr("y", popoverTextBoxY + 2)
    //         .attr("rx", 6)
    //         .attr("ry", 6)
    //         .attr("width", 16)
    //         .attr("height", 16)
    //         .attr("fill", "red")
    //         .attr({
    //           'stroke': 'black',
    //           'stroke-width': '1px'
    //         })
    //         .attr('style', 'fill-opacity:0.3; cursor: pointer;')
    //         .on('click', function() {
    //           cleanUpPopovers();
    //         });
    //
    //     });
    //
    // };
    //
    //
    // var cleanUpPopovers = function() {
    //   //popoverTextBox.remove();
    //   //popoverTextBoxClose.remove();
    //   //popoverText.remove();
    //   //popoverTextBoxCloseText.remove();
    // };
    //
    //
    // var wrap = function(text, width, popoverTextBoxX) {
    //   text.each(function() {
    //     var text = d3.select(this),
    //       words = text.text().split(/\s+/).reverse(),
    //       word,
    //       line = [],
    //       lineNumber = 0,
    //       lineHeight = 1.1, // ems
    //       y = text.attr("y"),
    //       dy = parseFloat(text.attr("dy")),
    //       tspan = text.text(null).append("tspan").attr("x", popoverTextBoxX + 3).attr("y", parseInt(y) + 20).attr("dy", 0 + "em");
    //     while (word = words.pop()) {
    //       line.push(word);
    //       tspan.text(line.join(" "));
    //       if (tspan.node().getComputedTextLength() > width) {
    //         line.pop();
    //         tspan.text(line.join(" "));
    //         line = [word];
    //         tspan = text.append("tspan").attr("x", popoverTextBoxX + 3).attr("y", parseInt(y) + 20).attr("dy", ++lineNumber + "em").text(word);
    //       }
    //     }
    //   });
    // };

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
    };
    
    return SvgChartsPopover;

  });
