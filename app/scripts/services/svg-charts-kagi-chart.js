'use strict';

/**
 * @ngdoc service
 * @name svgChartsApp.SvgChartsKagiChart
 * @description
 * # SvgChartsKagiChart
 * Factory in the svgChartsApp.
 */

/*global d3 */

angular.module('svgChartsApp')
  .factory('SvgChartsKagiChart', function (SvgChartsScene) {

    var SvgChartsKagiChart = {};
    
    SvgChartsKagiChart.init = function() {
      this.kagiLine = SvgChartsScene.svgContent.append('path').attr('name', 'kagiLine');
    };
    
    SvgChartsKagiChart.cleanUp = function() {
      this.kagiLine.attr('d', function() {});
    };

    SvgChartsKagiChart.render = function () {
      // var _this = this;
      //
      // var test = [
      //   135,
      //   132,
      //   128,
      //   133,
      //   130,
      //   129,
      //   127,
      //   134,
      //   139,
      //   137,
      //   145,
      //   158,
      //   147,
      //   143,
      //   150,
      //   149,
      //   160,
      //   164,
      //   167,
      //   156,
      //   165,
      //   168,
      //   171,
      //   173,
      //   169,
      //   177,
      //   180,
      //   176,
      //   170,
      //   165,
      //   169,
      //   173,
      //   170,
      //   170,
      //   168,
      //   165,
      //   171,
      //   175,
      //   179,
      //   175
      // ];

      //var line = d3.svg.line()
      //  .x(function (d) {
      //    return d.x;
      //  })
      //  .y(function (d) {
      //    return d.y;
      //  })
      //  .interpolate('step-after');

      //this.lines = this.kagiLine.selectAll('.kagi-line')
      //  .data(SvgChartsScene.chartData, function (d) {
      //    return d.date;
      //  });
      //
      //this.lines.enter()
      //  .append('g')
      //  .classed('kagi-line', true);
      //
      //this.lines.exit().remove();
      //
      //this.lines.transition()
      //  .duration(500)
      //  .ease("linear")
      //  .attr('d', function (d) {
      //    return line([
      //      { x: SvgChartsScene.x(d.date), y: SvgChartsScene.y(d.high) },
      //      { x: SvgChartsScene.x(d.date), y: SvgChartsScene.y(d.low) }
      //    ]);
      //  }).attr("stroke-width", 2)
      //  .attr("stroke", "black");



      //var sceneXStart = 10;

      //var sceneWidth = SvgChartsScene.width;
      //var sceneHeight = SvgChartsScene.height;

      var reversalAmount = SvgChartsScene.chartData.reverse()[0].close * parseFloat('.03');

      var previousReversal = SvgChartsScene.chartData.reverse()[0].close;

      var addStep = 0;

      angular.forEach(SvgChartsScene.chartData.reverse(), function(cData, cIndex) {


        //(<)-Move is less than reversal amount. No line is drawn.
        //*-Where the price exceeds the prior high or low (line changesthickness).
        //1 l-Up and down arrows-show direction of the current line on Exhibit 8.1.

        console.log('Session: ', cIndex + 1, 'date: ', cData.date, 'close', cData.close);

        if((cData.close > (previousReversal + reversalAmount))) {
          previousReversal = cData.close;
          addStep = addStep + 20;
          console.log('reversal up');
          //console.log('(Up)-Up and down arrows-show direction of the current line');

        }else if((cData.close < (previousReversal - reversalAmount))) {
          previousReversal = cData.close;
          addStep = addStep + 20;
          console.log('reversal down');
          //console.log('(Down)-Up and down arrows-show direction of the current line');

        }else{
          //console.log('(<)-Move is less than reversal amount. No line is drawn.');
        }

        //console.log('close', cData.close, 'previousReversal', previousReversal, 'reversalAmount', reversalAmount, 'addStep', addStep);


      });


      var line = d3.svg.line()
        .x(function (d) {

          //if(addStep) {
          //  sceneXStart = sceneXStart + addStep;
          //  addStep = 0;
          //  return sceneXStart;
          //}
          //
          //if((d.close > (previousReversal + reversalAmount)) || (d.close < (previousReversal - reversalAmount))) {
          //  previousReversal = d.close;
          //  addStep = 20;
          //}
          //
          //return sceneXStart;

          return SvgChartsScene.x(d.date);


        })
        .y(function (d) {
          return SvgChartsScene.y(d.close);
        });

        //.interpolate('step-after');


      SvgChartsKagiChart.kagiLine
        .datum(SvgChartsScene.chartData)
        .transition()
        .duration(500)
        .ease("linear")
        .attr('class', 'line')
        .attr('d', line)
        .attr('style', 'fill: none;stroke: steelblue;stroke-width: 1.5px;');
    };

    return SvgChartsKagiChart;

  });
