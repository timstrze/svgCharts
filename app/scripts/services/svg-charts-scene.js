'use strict';

/**
 * @ngdoc service
 * @name svgChartsApp.service:SvgChartsScene
 * @description
 * # SvgChartsScene
 * Factory that contains all the properties and methods for a SvgChartsScene
 *
 */

/*global d3 */

angular.module('svgChartsApp')
  .factory('SvgChartsScene', function () {

    var SvgChartsScene = {};





    /**
     * @ngdoc property
     * @name SvgChartsScene.margin
     * @propertyOf svgChartsApp.service:SvgChartsScene
     *
     * @description
     * Render svg items
     *
     */
    SvgChartsScene.margin = {
      top: 20,
      right: 40,
      bottom: 30,
      left: 0
    };





    /**
     * @ngdoc property
     * @name SvgChartsScene.height
     * @propertyOf svgChartsApp.service:SvgChartsScene
     *
     * @description
     * Render svg items
     *
     */
    SvgChartsScene.height = 100;





    /**
     * @ngdoc property
     * @name SvgChartsScene.width
     * @propertyOf svgChartsApp.service:SvgChartsScene
     *
     * @description
     * Render svg items
     *
     */
    SvgChartsScene.width = 100;





    /**
     * @ngdoc property
     * @name SvgChartsScene.parseDate
     * @propertyOf svgChartsApp.service:SvgChartsScene
     *
     * @description
     * Render svg items
     *
     */
    SvgChartsScene.parseDate = d3.time.format('%Y-%m-%d').parse;





    /**
     * @ngdoc function
     * @name SvgChartsScene.x
     * @methodOf svgChartsApp.service:SvgChartsScene
     *
     * @description
     * Render svg items
     *
     */
    SvgChartsScene.x = function() {};





    /**
     * @ngdoc function
     * @name SvgChartsScene.y
     * @methodOf svgChartsApp.service:SvgChartsScene
     *
     * @description
     * Render svg items
     *
     */
    SvgChartsScene.y = function() {};





    /**
     * @ngdoc function
     * @name SvgChartsScene.init
     * @methodOf svgChartsApp.service:SvgChartsScene
     *
     * @description
     * Render svg items
     *
     * @param {Object} element Html element
     *
     */
    SvgChartsScene.init = function (element) {
      this.svg = d3.select(element[0].querySelector('.svg-chart'))
        .attr('name', 'svgChart')
        .attr('style', 'background-color:#fff');

      this.svgContent = this.svg.selectAll(".svg-chart-content");
    };

    return SvgChartsScene;

  });
