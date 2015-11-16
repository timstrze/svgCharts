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
  .factory('SvgChartsAxis', function (SvgChartsScene) {

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


    return SvgChartsAxis;

  });
