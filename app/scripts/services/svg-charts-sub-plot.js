'use strict';

/**
 * @ngdoc service
 * @name svgChartsApp.service:SvgChartsSubPlot
 * @description
 * # SvgChartsSubPlot
 * Factory that contains all the properties and methods for a SvgChartsSubPlot
 *
 */
angular.module('svgChartsApp')
  .factory('SvgChartsSubPlot', function (SvgChartsScene) {

    var SvgChartsSubPlot = {};





    /**
     * @ngdoc function
     * @name SvgChartsSubPlot.init
     * @methodOf svgChartsApp.service:SvgChartsSubPlot
     *
     * @description
     * Public access to the GET, PUT, and POST methods
     *
     * @param {String} ID of the SvgChartsSubPlot
     */
    SvgChartsSubPlot.init =function() {

      this.subPlotPoints = SvgChartsScene.svgContent.append('g')
        .attr('name', 'subPlotPoints');
    };



    /**
     * @ngdoc function
     * @name SvgChartsSubPlot.cleanUp
     * @methodOf svgChartsApp.service:SvgChartsSubPlot
     *
     * @description
     * Public access to the GET, PUT, and POST methods
     *
     * @param {String} ID of the SvgChartsSubPlot
     */
    SvgChartsSubPlot.cleanUp =function() {

      this.subPlotPoints.selectAll('.subplot-points').remove();

    };




    SvgChartsSubPlot.renderSubPlots = function () {

      var subPlots = SvgChartsScene.subPlots;

      if(!subPlots) {
        subPlots = [];
      }

      var subPlotCircles = this.subPlotPoints.selectAll('.subplot-points')
        .data(subPlots);

      subPlotCircles
        .enter()
        .append('circle')
        .attr('style', 'cursor: pointer;')
        .attr('class', 'subplot-points')
        .on('click', function(d) {
          console.log(d);
        });

      subPlotCircles.exit().remove();

      subPlotCircles
        .transition()
        .duration(500)
        .ease("linear")
        .attr('fill', function (d) {
          return d.color || 'black';
        })
        .attr('stroke', function (d) {
          return d.strokeColor || '#fff';
        })
        .attr('cx', function(d) {
          return SvgChartsScene.x(d.date);
        })
        .attr('cy', function (d) {
          return SvgChartsScene.y(d.ask);
        })
        .attr('r', function(d) {
          return d.size || 4;
        });
    };



    return SvgChartsSubPlot;

  });
