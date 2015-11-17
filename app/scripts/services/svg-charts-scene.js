'use strict';

/**
 * @ngdoc service
 * @name svgChartsApp.service:SvgChartsScene
 * @description
 * # SvgChartsScene
 * Factory that contains all the properties and methods for a SvgChartsScene
 *
 */
angular.module('svgChartsApp')
  .factory('SvgChartsScene', function () {

    var SvgChartsScene = {};

    SvgChartsScene.margin = {
      top: 20,
      right: 40,
      bottom: 30,
      left: 0
    };

    SvgChartsScene.height = 100;
    SvgChartsScene.width = 100;

    SvgChartsScene.parseDate = d3.time.format('%Y-%m-%d').parse;


    SvgChartsScene.x = function() {};
    SvgChartsScene.y = function() {};

    SvgChartsScene.init = function (element) {

      this.svg = d3.select(element[0].querySelector('.svg-chart'))
        .attr('name', 'svgChart')
        .attr('style', 'background-color:#fff');


      this.svgContent = this.svg.selectAll(".svg-chart-content");

    };

    return SvgChartsScene;

  });
