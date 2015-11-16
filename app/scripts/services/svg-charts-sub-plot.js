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
     * @name SvgChartsSubPlot.http
     * @methodOf svgChartsApp.service:SvgChartsSubPlot
     *
     * @description
     * Public access to the GET, PUT, and POST methods
     *
     * @param {String} ID of the SvgChartsSubPlot
     */
    SvgChartsSubPlot.init =function() {
      $scope.chartPositions = SvgChartsScene.svgContent.append('path').attr('name', 'chartPositions');

    };


    return SvgChartsSubPlot;

  });
