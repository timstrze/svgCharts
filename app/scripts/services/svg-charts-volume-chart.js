'use strict';

/**
 * @ngdoc service
 * @name svgChartsApp.SvgChartsVolumeChart
 * @description
 * # SvgChartsVolumeChart
 * Factory in the svgChartsApp.
 */

/*global d3 */

angular.module('svgChartsApp')
  .factory('SvgChartsVolumeChart', function (SvgChartsScene) {

    var SvgChartsVolumeChart = {};
    
    
    
    /**
     * @ngdoc function
     * @name SvgChartsVolumeChart.init
     * @methodOf svgChartsApp.service:SvgChartsVolumeChart
     *
     * @description
     * Create svg items
     *
     */
    SvgChartsVolumeChart.init = function() {
      this.volumeContainer = SvgChartsScene.svgContent.append('g').attr('name', 'volumeContainer');
    };
    
    
    
    
    /**
     * @ngdoc function
     * @name SvgChartsVolumeChart.cleanUp
     * @methodOf svgChartsApp.service:SvgChartsVolumeChart
     *
     * @description
     * Create svg items
     *
     */
    SvgChartsVolumeChart.cleanUp = function() {
      this.volumeContainer.selectAll('.volume-rectangles').remove();
    };




    /**
     * @ngdoc function
     * @name SvgChartsVolumeChart.render
     * @methodOf svgChartsApp.service:SvgChartsVolumeChart
     *
     * @description
     * Render svg items
     *
     */
    SvgChartsVolumeChart.render = function () {
      //
      SvgChartsScene.y.domain(d3.extent(SvgChartsScene.chartData, function (d) {
        return d.volume;
      }));
      //
      var rect;
      var rectangleWidth = 8;
      // 
      rect = this.volumeContainer.selectAll('.volume-rectangles').data(SvgChartsScene.chartData);
      // 
      rect.enter().append('rect')
        .classed('volume-rectangles', true)
        .on('click', function(d) {console.log(d);});
      // 
      rect.exit().remove();
      // 
      rect
        .transition()
        .duration(500)
        .ease("linear")
        .attr({
          'fill': function(d) {
            return  (d.close > d.open) ? 'green' : 'red';
          }
        })
        .attr('x', function (d) {
          return SvgChartsScene.x(d.date) - rectangleWidth;
        })
        .attr('y', function (d) {
          return SvgChartsScene.y(d.volume);
        })
        .attr('width', rectangleWidth * 2)
        .attr('height', function (d) {
          return SvgChartsScene.height - SvgChartsScene.y(d.volume);
        });
    };

    return SvgChartsVolumeChart;

  });
