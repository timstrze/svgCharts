'use strict';

/**
 * @ngdoc overview
 * @name svgChartsApp
 * @description
 * # svgChartsApp
 *
 * Main module of the application.
 */
angular
  .module('svgChartsApp', [
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngMaterial',
    'ngMdIcons'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/svg-charts/demo', {
        templateUrl: 'views/demo/demo.html',
        controller: 'DemoController',
        controllerAs: 'ctrl'
      });
  });

'use strict';

/**
 * @ngdoc directive
 * @name svgChartsApp.directive:svg-chart
 * @element svg-chart
 * @restrict E
 *
 * @description
 * # svgChart
 * Directive to create a line chart based off a Symbol's historical data.
 *
 * @param {Array} historicalData An array of historical data
 */

/*global d3 */

angular.module('svgChartsApp')
  .directive('svgChart', function ($window, $mdMedia, SvgChartsScene, SvgChartsAxis, SvgChartsCandlestickChart,
                                   SvgChartsLineChart, SvgChartsOHLCChart, SvgChartsExtras,
                                   SvgChartsSubPlot, SvgChartsVolumeChart, SvgChartsKagiChart) {
    return {
      scope: {
        chartData: '=',
        selectedTheme: '=',
        selectedExtras: '=',
        selectedChart: '=',
        subPlots: '='
      },
      template: '<svg class="svg-chart"><g name="svgContent" class="svg-chart-content"></g></svg>',
      link: function postLink($scope, element) {


        SvgChartsScene.init(element);


        // Line chart elements
        SvgChartsLineChart.init();


        // Line chart elements
        SvgChartsVolumeChart.init();


        // Line chart elements
        SvgChartsKagiChart.init();


        // Line chart elements
        SvgChartsOHLCChart.init();


        SvgChartsCandlestickChart.init();


        //
        SvgChartsExtras.init();


        //
        SvgChartsSubPlot.init();


        // Axis
        SvgChartsAxis.init();


        // Functions
        $scope.formatData = function () {

          if ($scope.chartData && $scope.chartData.length) {
            // Format the historical data for d3
            SvgChartsScene.chartData = $scope.chartData.map(function (d) {
              return {
                date: SvgChartsScene.parseDate(d.Date),
                volume: parseInt(d.Volume),
                open: +d.Open,
                close: +d.Close,
                high: +d.High,
                low: +d.Low
              };
            });
          }


          if ($scope.subPlots && $scope.subPlots.length) {
            SvgChartsScene.subPlots = $scope.subPlots.map(function (d) {
              return {
                date: SvgChartsScene.parseDate(d.created.split(' ')[0]),
                ask: +d.ask,
                size: 8,
                bodyText: d.created.split(' ')[0] + ': ' + d.ask,
                strokeColor: 'white',
                color: 'green'
              };
            });
          }

        };


        $scope.resizeScene = function () {

          // Get the width of the parent element
          SvgChartsScene.width = element.parent()[0].offsetWidth - SvgChartsScene.margin.left - SvgChartsScene.margin.right;
          // Get the height of the parent element
          SvgChartsScene.height = element.parent()[0].offsetHeight - SvgChartsScene.margin.top - SvgChartsScene.margin.bottom;

          SvgChartsScene.x = d3.time.scale()
            .range([0, SvgChartsScene.width]);

          SvgChartsScene.y = d3.scale.linear()
            .range([SvgChartsScene.height, 0]);

          SvgChartsScene.x.domain(d3.extent(SvgChartsScene.chartData, function (d) {
            return d.date;
          }));

          //var n = 20; // n-period of moving average
          //var k = 2;  // k times n-period standard deviation above/below moving average
          //
          //
          //var bandsData = $scope.getBollingerBands(n, k, $scope.symbol.historicalData);


          SvgChartsScene.y.domain(d3.extent(SvgChartsScene.chartData, function (d) {
            return d.close;
          }));


          SvgChartsScene.svg
            .attr('width', SvgChartsScene.width + SvgChartsScene.margin.left + SvgChartsScene.margin.right)
            .attr('height', SvgChartsScene.height + SvgChartsScene.margin.top + SvgChartsScene.margin.bottom);

          SvgChartsScene.svgContent
            .attr('transform', 'translate(' + SvgChartsScene.margin.left + ',' + SvgChartsScene.margin.top + ')');
        };


        $scope.changeTheme = function (backgroundColor, fontColor) {

            SvgChartsScene.svg.attr('style', 'background-color:' + backgroundColor);

            SvgChartsAxis.xAxis.selectAll('text').attr('style', 'fill:' + fontColor);
            SvgChartsAxis.yAxis.selectAll('text').attr('style', 'fill:' + fontColor);

            SvgChartsLineChart.gradientStart.attr('stop-color', backgroundColor);
        };


        $scope.render = function () {

          $scope.formatData();

          $scope.resizeScene();

          if ($scope.selectedChart === 'ohlc-chart') {
            SvgChartsKagiChart.cleanUp();
            SvgChartsVolumeChart.cleanUp();
            SvgChartsCandlestickChart.cleanUp();
            SvgChartsLineChart.cleanUp();
            SvgChartsOHLCChart.render();
          }

          else if ($scope.selectedChart === 'candlestick-chart') {
            SvgChartsKagiChart.cleanUp();
            SvgChartsVolumeChart.cleanUp();
            SvgChartsLineChart.cleanUp();
            SvgChartsOHLCChart.cleanUp();
            SvgChartsCandlestickChart.render();
          }

          else if ($scope.selectedChart === 'kagi-chart') {
            SvgChartsVolumeChart.cleanUp();
            SvgChartsLineChart.cleanUp();
            SvgChartsOHLCChart.cleanUp();
            SvgChartsCandlestickChart.cleanUp();
            SvgChartsKagiChart.render();
          }

          else if ($scope.selectedChart === 'volume-chart') {
            SvgChartsKagiChart.cleanUp();
            SvgChartsLineChart.cleanUp();
            SvgChartsOHLCChart.cleanUp();
            SvgChartsCandlestickChart.cleanUp();
            SvgChartsVolumeChart.render();
          }

          else {
            SvgChartsKagiChart.cleanUp();
            SvgChartsVolumeChart.cleanUp();
            SvgChartsCandlestickChart.cleanUp();
            SvgChartsOHLCChart.cleanUp();
            SvgChartsLineChart.render();
          }


          if ($scope.selectedExtras && $scope.selectedExtras.toString().indexOf('data-points') > -1) {
            SvgChartsExtras.renderDataPoints();
          } else {
            SvgChartsExtras.cleanUpDataPoints();
          }

          if ($scope.selectedExtras && $scope.selectedExtras.toString().indexOf('moving-average') > -1) {
            SvgChartsExtras.renderMovingAverage();
          } else {
            SvgChartsExtras.movingAverageCleanup();
          }

          if ($scope.selectedExtras && $scope.selectedExtras.toString().indexOf('bollinger-bands') > -1) {
            SvgChartsExtras.renderBollingerBands();
          } else {
            SvgChartsExtras.bollingerBandsCleanup();
          }

          if ($scope.selectedExtras && $scope.selectedExtras.toString().indexOf('sub-plot-points') > -1) {
            SvgChartsSubPlot.renderSubPlots();
          } else {
            SvgChartsSubPlot.cleanUp();
          }


          $scope.previousSelectedChart = $scope.selectedChart;
          $scope.previousSelectedExtras = $scope.selectedExtras;


          SvgChartsAxis.renderXYAxis($scope.selectedTheme.background, $scope.selectedTheme.font);


          if ($scope.selectedTheme && $scope.selectedTheme.background && $scope.selectedTheme.font) {
            $scope.changeTheme($scope.selectedTheme.background, $scope.selectedTheme.font);
          } else {
            $scope.changeTheme('#FFFFFF', '#000000');
          }

        };


        /**
         * @ngdoc function
         * @name $watch
         * @eventOf svgChartsApp.directive:base-chart
         *
         * @description
         * Watches the Symbol historicalData Array and calls the render Function.
         *
         */
        $scope.$watch(function () {
          if ($scope.chartData) {
            return JSON.stringify([$scope.chartData, $scope.subPlots, $scope.selectedChart, $scope.selectedExtras, $scope.selectedTheme]);
          }
        }, function () {
          // Make sure there is historical data
          if ($scope.chartData && $scope.chartData.length > 0) {
            $scope.render();
          }
        }, true);


        /**
         * @ngdoc function
         * @name $on
         * @eventOf svgChartsApp.directive:base-chart
         *
         * @description
         * Watches the window and renders the line chart
         *
         */
        angular.element($window).on('resize', function () {
          // Make sure there is historical data
          if ($scope.chartData && $scope.chartData.length > 0) {
            $scope.render();
          }
        });
      }
    };
  });

'use strict';

/**
 * @ngdoc service
 * @name svgChartsApp.SvgChartsCandlestickChart
 * @description
 * # SvgChartsCandlestickChart
 * Factory in the svgChartsApp.
 */

/*global d3 */

angular.module('svgChartsApp')
  .factory('SvgChartsCandlestickChart', function (SvgChartsScene) {

    var SvgChartsCandlestickChart = {};

    SvgChartsCandlestickChart.init = function () {

      this.candleStickContainer = SvgChartsScene.svgContent.append('g')
        .attr('name', 'candleStickBars');
    };

    SvgChartsCandlestickChart.cleanUp = function () {

      if (this.bars) {
        this.bars.remove();
        this.bars.selectAll('.candlestick-rectangles').remove();
      }

    };

    var line = d3.svg.line()
      .x(function (d) {
        return d.x;
      })
      .y(function (d) {
        return d.y;
      });


    var isUpDay = function (d) {
      return d.close > d.open;
    };


    var applyCandlestick = function (bars) {

      var rect;
      var rectangleWidth = 3;

      rect = bars.selectAll('.candlestick-rectangles').data(function (d) {
        return [d];
      });

      rect.enter().append('rect')
        .classed('candlestick-rectangles', true);

      rect.exit().remove();

      rect
        .transition()
        .duration(500)
        .ease("linear")
        .attr('x', function (d) {
          return SvgChartsScene.x(d.date) - rectangleWidth;
        })
        .attr('y', function (d) {
          return isUpDay(d) ? SvgChartsScene.y(d.close) : SvgChartsScene.y(d.open);
        })
        .attr('width', rectangleWidth * 2)
        .attr('height', function (d) {
          return isUpDay(d) ? SvgChartsScene.y(d.open) - SvgChartsScene.y(d.close) : SvgChartsScene.y(d.close) - SvgChartsScene.y(d.open);
        });

    };

    SvgChartsCandlestickChart.render = function () {

      this.bars = this.candleStickContainer.selectAll('.candlestick-bar')
        .data(SvgChartsScene.chartData, function (d) {
          return d.date;
        });

      this.bars.enter()
        .append('g')
        .classed('candlestick-bar', true);

      this.bars.exit().remove();

      this.bars.attr({
        'fill': function (d) {
          return isUpDay(d) ? 'green' : 'red';
        }
      });

      var paths = this.bars.selectAll('.high-low-line').data(function (d) {
        return [d];
      });

      paths.enter().append('path')
        .classed('high-low-line', true);

      paths.exit().remove();

      paths.transition()
        .duration(500)
        .ease("linear")
        .attr('d', function (d) {
          return line([
            {x: SvgChartsScene.x(d.date), y: SvgChartsScene.y(d.high)},
            {x: SvgChartsScene.x(d.date), y: SvgChartsScene.y(d.low)}
          ]);
        })
        .attr({
          'stroke': function (d) {
            return isUpDay(d) ? 'green' : 'red';
          }
        });


      applyCandlestick(this.bars);

    };

    return SvgChartsCandlestickChart;

  });

'use strict';

/**
 * @ngdoc service
 * @name svgChartsApp.SvgChartsLineChart
 * @description
 * # SvgChartsLineChart
 * Factory in the svgChartsApp.
 */

/*global d3 */

angular.module('svgChartsApp')
  .factory('SvgChartsLineChart', function (SvgChartsScene) {

    var SvgChartsLineChart = {};


    SvgChartsLineChart.init = function() {

      this.gradient = SvgChartsScene.svgContent.append('svg:defs')
        .append('svg:linearGradient')
        .attr('id', 'gradient')
        .attr('x1', '100%')
        .attr('y1', '100%')
        .attr('x2', '100%')
        .attr('y2', '0%')
        .attr('name', 'linear-gradient')
        .attr('spreadMethod', 'pad');

      this.gradientStart = this.gradient.append('svg:stop')
        .attr('offset', '0%')
        .attr('stop-color', '#444')
        .attr('stop-opacity', 1);

      this.gradientStop = this.gradient.append('svg:stop')
        .attr('offset', '100%')
        .attr('stop-color', '#b8e1fc')
        .attr('stop-opacity', 1);


      SvgChartsLineChart.chartArea = SvgChartsScene.svgContent.append('path').attr('name', 'chartArea')
        .style('fill', 'url(#gradient)');

      SvgChartsLineChart.chartLine = SvgChartsScene.svgContent.append('path').attr('name', 'chartLine');
    };


    SvgChartsLineChart.cleanUp = function() {
      SvgChartsLineChart.chartArea.attr('d', function() {});
      SvgChartsLineChart.chartLine.attr('d', function() {});
    };


    SvgChartsLineChart.render = function () {

      var line = d3.svg.line()
        .x(function (d) {
          return SvgChartsScene.x(d.date);
        })
        .y(function (d) {
          return SvgChartsScene.y(d.close);
        });

      var area = d3.svg.area()
        .x(function(d) { return SvgChartsScene.x(d.date); })
        .y0(SvgChartsScene.height)
        .y1(function(d) { return SvgChartsScene.y(d.close); });

      SvgChartsLineChart.chartArea
        .datum(SvgChartsScene.chartData)
        .transition()
        .duration(500)
        .ease("linear")
        .attr("class", "area")
        .attr("d", area);

      SvgChartsLineChart.chartLine
        .datum(SvgChartsScene.chartData)
        .transition()
        .duration(500)
        .ease("linear")
        .attr('class', 'line')
        .attr('d', line)
        .attr('style', 'fill: none;stroke: steelblue;stroke-width: 1.5px;');
    };


    return SvgChartsLineChart;

  });

'use strict';

/**
 * @ngdoc service
 * @name svgChartsApp.SvgChartsOHLCChart
 * @description
 * # SvgChartsOHLCChart
 * Factory in the svgChartsApp.
 */

/*global d3 */

angular.module('svgChartsApp')
  .factory('SvgChartsOHLCChart', function (SvgChartsScene) {

    var SvgChartsOHLCChart = {};

    SvgChartsOHLCChart.init = function() {

      this.ohlcContainer = SvgChartsScene.svgContent.append('g')
        .attr('name', 'ohlcBars');

    };


    var line = d3.svg.line()
      .x(function (d) {
        return d.x;
      })
      .y(function (d) {
        return d.y;
      });

    SvgChartsOHLCChart.cleanUp = function() {

      if(this.bars) {
        this.bars.remove();
        this.bars.selectAll('.high-low-line').remove();
        this.bars.selectAll('.open-tick').remove();
        this.bars.selectAll('.close-tick').remove();
      }

    };



    var isUpDay = function(d) {
      return d.close > d.open;
    };

    var applyOHLC = function (bars) {

      var tickWidth = 5;

      var open = bars.selectAll('.open-tick').data(function (d) {
        return [d];
      });

      var close = bars.selectAll('.close-tick').data(function (d) {
        return [d];
      });

      open.enter().append('path').classed('open-tick', true);

      open.exit().remove();

      close.enter().append('path').classed('close-tick', true);

      close.exit().remove();

      open.transition()
        .duration(500)
        .ease("linear")
        .attr('d', function (d) {
          return line([
            {x: SvgChartsScene.x(d.date) - tickWidth, y: SvgChartsScene.y(d.open)},
            {x: SvgChartsScene.x(d.date), y: SvgChartsScene.y(d.open)}
          ]);
        })
        .attr({
          'stroke': function(d) {
            return  isUpDay(d) ? 'green' : 'red';
          }
        });

      close.transition()
        .duration(500)
        .ease("linear")
        .attr('d', function (d) {
          return line([
            {x: SvgChartsScene.x(d.date), y: SvgChartsScene.y(d.close)},
            {x: SvgChartsScene.x(d.date) + tickWidth, y: SvgChartsScene.y(d.close)}
          ]);
        })
        .attr({
          'stroke': function(d) {
            return  isUpDay(d) ? 'green' : 'red';
          }
        });

    };



    SvgChartsOHLCChart.render = function () {

      this.bars = this.ohlcContainer.selectAll('.ohlc-bar')
        .data(SvgChartsScene.chartData, function (d) {
          return d.date;
        });

      this.bars.enter()
        .append('g')
        .classed('ohlc-bar', true);

      this.bars.exit().remove();

      this.bars.attr({
        'fill': function(d) {
          return  isUpDay(d) ? 'green' : 'red';
        }
      });

      var paths = this.bars.selectAll('.high-low-line').data(function (d) {
        return [d];
      });

      paths.enter().append('path')
        .classed('high-low-line', true);

      paths.exit().remove();

      paths.transition()
        .duration(500)
        .ease("linear")
        .attr('d', function (d) {
          return line([
            { x: SvgChartsScene.x(d.date), y: SvgChartsScene.y(d.high) },
            { x: SvgChartsScene.x(d.date), y: SvgChartsScene.y(d.low) }
          ]);
        })
        .attr({
          'stroke': function(d) {
            return  isUpDay(d) ? 'green' : 'red';
          }
        });


        applyOHLC(this.bars);


    };

    return SvgChartsOHLCChart;

  });

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
     * @name svgChartsPopover.http
     * @methodOf svgChartsApp.service:svgChartsPopover
     *
     * @description
     * Public access to the GET, PUT, and POST methods
     *
     * @param {String} ID of the svgChartsPopover
     */
    SvgChartsPopover.init = function() {

    };


    return SvgChartsPopover;

  });

'use strict';

/**
 * @ngdoc service
 * @name svgChartsApp.service:SvgChartsExtras
 * @description
 * # SvgChartsExtras
 * Factory that contains all the properties and methods for a SvgChartsExtras
 *
 */

/*global d3 */

angular.module('svgChartsApp')
  .factory('SvgChartsExtras', function (SvgChartsScene) {

    var SvgChartsExtras = {};

    SvgChartsExtras.init = function () {
      this.bollingerBandArea = SvgChartsScene.svgContent.append('svg:path')
        .attr('class', 'bollinger-band-area')
        .attr('style', 'fill: grey;').attr('fill-opacity', 0.2);

      this.bollingerBandHigh = SvgChartsScene.svgContent.append('svg:path')
        .attr('class', 'band bollinger-band-high')
        .attr('style', 'stroke: black; fill: none;');

      this.bollingerBandLow = SvgChartsScene.svgContent.append('svg:path')
        .attr('class', 'band bollinger-band-low')
        .attr('style', 'stroke: black; fill: none;');

      this.movingAvgLine = SvgChartsScene.svgContent.append('svg:path')
        .attr('class', 'moving-average')
        .attr('style', 'stroke: #FF9900; fill: none;');

      this.chartPlotPoints = SvgChartsScene.svgContent.append('g')
        .attr('name', 'chartPlotPoints');

    };


    var movingAvg = function (n) {
      return function (points) {
        points = points.map(function (each, index, array) {
          var to = index + n - 1;
          var subSeq, sum;
          if (to < points.length) {
            subSeq = array.slice(index, to + 1);
            sum = subSeq.reduce(function (a, b) {
              return [a[0] + b[0], a[1] + b[1]];
            });
            return sum.map(function (each) {
              return each / n;
            });
          }
          return undefined;
        });
        points = points.filter(function (each) {
          return typeof each !== 'undefined';
        });
        // Transform the points into a basis line
        var pathDesc = d3.svg.line().interpolate('basis')(points);
        // Remove the extra 'M'
        return pathDesc.slice(1, pathDesc.length);
      };
    };

    SvgChartsExtras.movingAverageCleanup = function () {
      this.movingAvgLine.attr('d', function () {
      });
    };

    SvgChartsExtras.renderMovingAverage = function () {

      var movingAverageLine = d3.svg.line()
        .x(function (d) {
          return SvgChartsScene.x(d.date);
        })
        .y(function (d) {
          return SvgChartsScene.y(d.close);
        })
        .interpolate(movingAvg(3));

      this.movingAvgLine
        .transition()
        .duration(500)
        .ease("linear")
        .attr('d', movingAverageLine(SvgChartsScene.chartData));
    };


    SvgChartsExtras.renderBollingerBands = function () {

      //var _movingSum;
      var bollingerBandLow = d3.svg.line()
        .x(function (d) {
          return SvgChartsScene.x(d.date);
        })
        .y(function (d) {
          return SvgChartsScene.y(d.low);
        })
        .interpolate(movingAvg(3));


      var bollingerBandArea = d3.svg.area()
        .x(function (d) {
          return SvgChartsScene.x(d.date);
        })
        .y0(function (d) {
          return SvgChartsScene.y(d.low);
        })
        .y1(function (d) {
          return SvgChartsScene.y(d.high);
        })
        .interpolate(movingAvg(3));

      var bollingerBandHigh = d3.svg.line()
        .x(function (d) {
          return SvgChartsScene.x(d.date);
        })
        .y(function (d) {
          return SvgChartsScene.y(d.high);
        })
        .interpolate(movingAvg(3));

      this.bollingerBandLow
        .transition()
        .duration(500)
        .ease("linear")
        .attr('d', bollingerBandLow(SvgChartsScene.chartData));

      this.bollingerBandHigh
        .transition()
        .duration(500)
        .ease("linear")
        .attr('d', bollingerBandHigh(SvgChartsScene.chartData));

      this.bollingerBandArea
        .transition()
        .duration(500)
        .ease("linear")
        .attr('d', bollingerBandArea(SvgChartsScene.chartData));
    };

    SvgChartsExtras.bollingerBandsCleanup = function () {
      this.bollingerBandHigh.attr('d', function () {
      });
      this.bollingerBandLow.attr('d', function () {
      });
      this.bollingerBandArea.attr('d', function () {
      });
    };

    // var getBollingerBands = function (n, k, data) {
    //   var bands = []; //{ ma: 0, low: 0, high: 0 }
    //   var stdDev = Math.sqrt(d3.mean(slice.map(function (d) {
    //     return Math.pow(d.close - mean, 2);
    //   })));
    //   for (var i = n - 1, len = data.length; i < len; i++) {
    //     var slice = data.slice(i + 1 - n, i);
    //     var mean = d3.mean(slice, function (d) {
    //       return d.close;
    //     });
    //     bands.push({
    //       date: data[i].date,
    //       ma: mean,
    //       low: mean - (k * stdDev),
    //       high: mean + (k * stdDev)
    //     });
    //   }
    //   return bands;
    // };


    SvgChartsExtras.cleanUpDataPoints = function () {
      this.chartPlotPoints.selectAll('.data-points').remove();

    };

    SvgChartsExtras.renderDataPoints = function () {

      var dataPoints = this.chartPlotPoints.selectAll('.data-points')
        .data(SvgChartsScene.chartData);

      dataPoints.enter()
        .append('circle')
        .attr('name', function (d) {
          return d.Symbol;
        })
        .on('click', function (d) {
          console.log(d);
        })
        .attr('style', 'cursor: pointer;')
        .attr('class', 'data-points')
        .attr('fill', '#3F51B5')
        .attr('stroke', '#fff');

      dataPoints.exit().remove();

      dataPoints
        .transition()
        .duration(500)
        .ease("linear")
        .attr('cx', function (d) {
          return SvgChartsScene.x(d.date);
        })
        .attr('cy', function (d) {
          return SvgChartsScene.y(d.close);
        })
        .attr('r', function () {
          return 4;
        });

    };


    return SvgChartsExtras;

  });

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

    SvgChartsAxis.renderXYAxis = function (backgroundColor, fontColor) {


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
          'opacity': .8,
          'shape-rendering': 'crispEdges',
          'stroke': fontColor
        });


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
            'opacity': .8,
            'stroke': fontColor,
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
            },
            'stroke': function() {
              return fontColor;
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
            'opacity': .8,
            'stroke': fontColor,
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
            'y2': SvgChartsScene.height,
            'stroke': function() {
              return fontColor;
            }
          });


      SvgChartsAxis.xAxis.selectAll('text').attr('stroke-width', '0px');

      SvgChartsAxis.yAxis.selectAll('text').attr('stroke-width', '0px');

    };


    return SvgChartsAxis;

  });

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

      if(subPlots && subPlots.length > 0) {

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
      }
    };



    return SvgChartsSubPlot;

  });

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


    SvgChartsVolumeChart.init = function() {

      this.volumeContainer = SvgChartsScene.svgContent.append('g').attr('name', 'volumeContainer');
    };


    SvgChartsVolumeChart.cleanUp = function() {

      this.volumeContainer.selectAll('.volume-rectangles').remove();

    };


    SvgChartsVolumeChart.render = function () {

      SvgChartsScene.y.domain(d3.extent(SvgChartsScene.chartData, function (d) {
        return d.volume;
      }));

      var rect;
      var rectangleWidth = 8;

      rect = this.volumeContainer.selectAll('.volume-rectangles').data(SvgChartsScene.chartData);

      rect.enter().append('rect')
        .classed('volume-rectangles', true)
        .on('click', function(d) {console.log(d);});

      rect.exit().remove();

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
