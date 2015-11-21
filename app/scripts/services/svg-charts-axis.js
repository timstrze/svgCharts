'use strict';

/**
 * @ngdoc service
 * @name svgChartsApp.service:SvgChartsAxis
 * @description
 * # SvgChartsAxis
 * Factory that contains all the properties and methods for a SvgChartsAxis
 *
 */
angular.module('svgChartsApp')
  .factory('SvgChartsAxis', function (SvgChartsScene, $mdMedia) {

    var SvgChartsAxis = {};





    /**
     * @ngdoc function
     * @name SvgChartsAxis.init
     * @methodOf svgChartsApp.service:SvgChartsAxis
     *
     * @description
     * Public access to the GET, PUT, and POST methods
     *
     * @param {String} ID of the SvgChartsAxis
     */
    SvgChartsAxis.init = function () {
      SvgChartsAxis.xAxis = SvgChartsScene.svgContent.append('g').attr('name', 'xAxis');

      SvgChartsAxis.yAxis = SvgChartsScene.svgContent.append('g').attr('name', 'yAxis');

      SvgChartsAxis.horizontalGrid = SvgChartsScene.svgContent.append('g').attr('name', 'horizontalGrid');

      SvgChartsAxis.verticalGrid = SvgChartsScene.svgContent.append('g').attr('name', 'verticalGrid');

    };

    SvgChartsAxis.renderXYAxis = function () {


      var xAxis = d3.svg.axis()
        .scale(SvgChartsScene.x)
        .orient('bottom');


        xAxis.ticks(SvgChartsScene.width / 120);


      var yAxis = d3.svg.axis()
        .scale(SvgChartsScene.y)
        .orient('right');

      yAxis.ticks(SvgChartsScene.height / 100);


      SvgChartsAxis.xAxis
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + (SvgChartsScene.height) + ')')
        .call(xAxis)
        .attr({
          'fill': 'none',
          'shape-rendering': 'crispEdges',
          'stroke': 'rgba(0,0,0,0.54)'
        });


      SvgChartsAxis.yAxis
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + (SvgChartsScene.width) + ',0)')
        .call(yAxis)
        .attr({
          'fill': 'none',
          'shape-rendering': 'crispEdges',
          'stroke': 'rgba(0,0,0,0.54)'
        });


      var horizontalGridLine =  SvgChartsAxis.horizontalGrid.selectAll('line')
        .data(SvgChartsScene.y.ticks(SvgChartsScene.height / 100));

      horizontalGridLine
        .enter()
        .append('line')
        .attr(
          {
            'class': 'horizontalGrid',
            'x1': 0,
            'fill': 'none',
            'shape-rendering': 'crispEdges',
            'stroke': '#C7C7C7',
            'stroke-width': '1px',
            'stroke-dasharray': '5, 5'
          });

      horizontalGridLine.exit().remove();

      horizontalGridLine
        .attr(
          {
            'x2': SvgChartsScene.width,
            'y1': function (d) {
              return SvgChartsScene.y(d);
            },
            'y2': function (d) {
              return SvgChartsScene.y(d);
            }
          });


      var verticalGridLine = SvgChartsAxis.verticalGrid.selectAll('line')
        .data(SvgChartsScene.x.ticks(SvgChartsScene.width / 120));

      verticalGridLine
        .enter()
        .append('line')
        .attr(
          {
            'class': 'verticalGrid',
            'fill': 'none',
            'shape-rendering': 'crispEdges',
            'stroke': '#C7C7C7',
            'stroke-width': '1px',
            'stroke-dasharray': '5, 5'
          });

      verticalGridLine.exit().remove();

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
            'y2': SvgChartsScene.height
          });


      SvgChartsAxis.xAxis.selectAll('text').attr('style', 'fill:rgba(0,0,0,0.54);').attr('stroke-width', '0px');

      SvgChartsAxis.yAxis.selectAll('text').attr('style', 'fill:rgba(0,0,0,0.54);').attr('stroke-width', '0px');

    };


    return SvgChartsAxis;

  });
