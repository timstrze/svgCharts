'use strict';

/**
 * @ngdoc service
 * @name svgChartsApp.service:SvgChartsAxis
 * @description
 * # SvgChartsAxis
 * Factory that contains all the properties and methods for a SvgChartsAxis
 *
 */

/*global d3 */

angular.module('svgChartsApp')
  .factory('SvgChartsAxis', function (SvgChartsScene) {

    var SvgChartsAxis = {};
    



    /**
     * @ngdoc function
     * @name SvgChartsAxis.init
     * @methodOf svgChartsApp.service:SvgChartsAxis
     *
     * @description
     * Create svg items
     *
     */
    SvgChartsAxis.init = function () {
      //
      SvgChartsAxis.xAxis = SvgChartsScene.svgContent.append('g').attr('name', 'xAxis');
      //
      SvgChartsAxis.yAxis = SvgChartsScene.svgContent.append('g').attr('name', 'yAxis');
      // 
      SvgChartsAxis.horizontalGrid = SvgChartsScene.svgContent.append('g').attr('name', 'horizontalGrid');
      // 
      SvgChartsAxis.verticalGrid = SvgChartsScene.svgContent.append('g').attr('name', 'verticalGrid');
    };





    /**
     * @ngdoc function
     * @name SvgChartsAxis.renderXYAxis
     * @methodOf svgChartsApp.service:SvgChartsAxis
     *
     * @description
     * Render the X Y Axis
     *
     * @param {String} backgroundColor of the background
     * @param {String} fontColor of the font color
     */
    SvgChartsAxis.renderXYAxis = function (backgroundColor, fontColor) {
      //
      var xAxis = d3.svg.axis()
        .scale(SvgChartsScene.x)
        .orient('bottom');
      //
      xAxis.ticks(SvgChartsScene.width / 120);
      //
      var yAxis = d3.svg.axis()
        .scale(SvgChartsScene.y)
        .orient('right');
      //
      yAxis.ticks(SvgChartsScene.height / 100);
      //
      SvgChartsAxis.xAxis
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + (SvgChartsScene.height) + ')')
        .call(xAxis)
        .attr({
          'fill': 'none',
          'opacity': .8,
          'shape-rendering': 'crispEdges',
          'stroke': fontColor
        });
      //
      SvgChartsAxis.yAxis
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + (SvgChartsScene.width) + ',0)')
        .call(yAxis)
        .attr({
          'fill': 'none',
          'opacity': .8,
          'shape-rendering': 'crispEdges',
          'stroke': fontColor
        });
      //
      var horizontalGridLine =  SvgChartsAxis.horizontalGrid.selectAll('line')
        .data(SvgChartsScene.y.ticks(SvgChartsScene.height / 100));
      //
      horizontalGridLine
        .enter()
        .append('line')
        .attr(
          {
            'class': 'horizontalGrid',
            'x1': 0,
            'fill': 'none',
            'shape-rendering': 'crispEdges',
            'opacity': .8,
            'stroke': fontColor,
            'stroke-width': '1px',
            'stroke-dasharray': '5, 5'
          });
      //
      horizontalGridLine.exit().remove();
      //
      horizontalGridLine
        .attr(
          {
            'x2': SvgChartsScene.width,
            'y1': function (d) {
              return SvgChartsScene.y(d);
            },
            'y2': function (d) {
              return SvgChartsScene.y(d);
            },
            'stroke': function() {
              return fontColor;
            }
          });
      //
      var verticalGridLine = SvgChartsAxis.verticalGrid.selectAll('line')
        .data(SvgChartsScene.x.ticks(SvgChartsScene.width / 120));
      //
      verticalGridLine
        .enter()
        .append('line')
        .attr(
          {
            'class': 'verticalGrid',
            'fill': 'none',
            'shape-rendering': 'crispEdges',
            'opacity': .8,
            'stroke': fontColor,
            'stroke-width': '1px',
            'stroke-dasharray': '5, 5'
          });
      //
      verticalGridLine.exit().remove();
      //
      verticalGridLine
        .attr(
          {
            'x1': function (d) {
              return SvgChartsScene.x(d);
            },
            'x2': function (d) {
              return SvgChartsScene.x(d);
            },
            'y1': -SvgChartsScene.margin.top,
            'y2': SvgChartsScene.height,
            'stroke': function() {
              return fontColor;
            }
          });
      //
      SvgChartsAxis.xAxis.selectAll('text').attr('stroke-width', '0px');
      //
      SvgChartsAxis.yAxis.selectAll('text').attr('stroke-width', '0px');
    };

    return SvgChartsAxis;

  });
