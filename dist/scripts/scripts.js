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
                                   SvgChartsLineChart, SvgChartsOHLCChart, SvgChartsExtras, SvgChartsPopover,
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

        // Initiate the scene
        SvgChartsScene.init(element);
        // Line chart elements
        SvgChartsLineChart.init();
        // Line chart elements
        SvgChartsVolumeChart.init();
        // Line chart elements
        SvgChartsKagiChart.init();
        // Line chart elements
        SvgChartsOHLCChart.init();
        // Candlestick chart elements
        SvgChartsCandlestickChart.init();
        // Moving Average, Data Points, and Split View elements
        SvgChartsExtras.init();
        // Sub Plot points elements
        SvgChartsSubPlot.init();
        // Axis elements
        SvgChartsAxis.init();
        // Pop over windows
        SvgChartsPopover.init();


        /**
         * @ngdoc function
         * @name formatData
         * @methodOf svgChartsApp.directive:base-chart
         *
         * @description
         * Format the data
         *
         */
        $scope.formatData = function () {
          // Check to see if there is chart data
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
          // Check to see if there is sub plot data
          if ($scope.subPlots && $scope.subPlots.length) {
            // Format the historical data for d3
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
          } else {
            // Create an empty sub plot array
            SvgChartsScene.subPlots = [];
          }
        };



        /**
         * @ngdoc function
         * @name resizeScene
         * @methodOf svgChartsApp.directive:base-chart
         *
         * @description
         * Resize the scene and the x,y scale
         *
         */
        $scope.resizeScene = function () {
          // Get the width of the parent element
          SvgChartsScene.width = element.parent()[0].offsetWidth - SvgChartsScene.margin.left - SvgChartsScene.margin.right;
          // Get the height of the parent element
          SvgChartsScene.height = element.parent()[0].offsetHeight - SvgChartsScene.margin.top - SvgChartsScene.margin.bottom;
          // Create the x scale
          SvgChartsScene.x = d3.time.scale()
            .range([0, SvgChartsScene.width]);
          // Create the y scale
          SvgChartsScene.y = d3.scale.linear()
            .range([SvgChartsScene.height, 0]);
          // Create the x domain
          SvgChartsScene.x.domain(d3.extent(SvgChartsScene.chartData, function (d) {
            return d.date;
          }));
          // Create the y domain
          SvgChartsScene.y.domain(d3.extent(SvgChartsScene.chartData, function (d) {
            return d.close;
          }));
          // Set the width and height of the svg
          SvgChartsScene.svg
            .attr('width', SvgChartsScene.width + SvgChartsScene.margin.left + SvgChartsScene.margin.right)
            .attr('height', SvgChartsScene.height + SvgChartsScene.margin.top + SvgChartsScene.margin.bottom);
          // Scale scene
          SvgChartsScene.svgContent
            .attr('transform', 'translate(' + SvgChartsScene.margin.left + ',' + SvgChartsScene.margin.top + ')');
        };





        /**
         * @ngdoc function
         * @name changeTheme
         * @methodOf svgChartsApp.directive:base-chart
         *
         * @description
         * Format the data
         *
         */
        $scope.changeTheme = function (backgroundColor, fontColor) {
            // Set the background color
            SvgChartsScene.svg.attr('style', 'background-color:' + backgroundColor);
            // Set the text color of the x axis
            SvgChartsAxis.xAxis.selectAll('text').attr('style', 'fill:' + fontColor);
            // Set the text color of the y axis
            SvgChartsAxis.yAxis.selectAll('text').attr('style', 'fill:' + fontColor);
            // Set the background color of the background for the line chart
            SvgChartsLineChart.gradientStart.attr('stop-color', backgroundColor);
        };





        /**
         * @ngdoc function
         * @name render
         * @methodOf svgChartsApp.directive:base-chart
         *
         * @description
         * Render the scene
         *
         */
        $scope.render = function () {
          // Format the data
          // TODO: remove this and format before it gets to the directive
          $scope.formatData();
          // Resize the scene
          $scope.resizeScene();
          // TODO: Remove the manual initiation of features
          // Set the selected chart
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

          // SELECTED EXTRAS
          // TODO: Remove the manual initiation of features
          // Render the data points
          if ($scope.selectedExtras && $scope.selectedExtras.toString().indexOf('data-points') > -1) {
            SvgChartsExtras.renderDataPoints();
          }
          else {
            SvgChartsExtras.cleanUpDataPoints();
          }
          // Render the moving average
          if ($scope.selectedExtras && $scope.selectedExtras.toString().indexOf('moving-average') > -1) {
            SvgChartsExtras.renderMovingAverage();
          }
          else {
            SvgChartsExtras.movingAverageCleanup();
          }
          // Render the Bollinger Bands
          if ($scope.selectedExtras && $scope.selectedExtras.toString().indexOf('bollinger-bands') > -1) {
            SvgChartsExtras.renderBollingerBands();
          }
          else {
            SvgChartsExtras.bollingerBandsCleanup();
          }
          // Render the sub plot points
          if ($scope.selectedExtras && $scope.selectedExtras.toString().indexOf('sub-plot-points') > -1) {
            SvgChartsSubPlot.renderSubPlots();
          }
          else {
            SvgChartsSubPlot.cleanUp();
          }

          // Remove any previous popovers
          SvgChartsPopover.cleanUpPopovers();

          // Set the previous selected chart
          $scope.previousSelectedChart = $scope.selectedChart;
          // Set the previous selected extras
          $scope.previousSelectedExtras = $scope.selectedExtras;
          // Render the X and Y axis
          SvgChartsAxis.renderXYAxis($scope.selectedTheme.background, $scope.selectedTheme.font);
          // Set the theme of the background and font colors
          if ($scope.selectedTheme && $scope.selectedTheme.background && $scope.selectedTheme.font) {
            $scope.changeTheme($scope.selectedTheme.background, $scope.selectedTheme.font);
          }
          else {
            // Set the defaults as white
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
          // Watch the historicalData
          if ($scope.chartData) {
            return JSON.stringify([$scope.chartData, $scope.subPlots, $scope.selectedChart, $scope.selectedExtras, $scope.selectedTheme]);
          }
        }, function () {
          // Make sure there is historical data
          if ($scope.chartData && $scope.chartData.length > 0) {
            // Render the chart
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
            // Render the chart
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




    /**
     * @ngdoc function
     * @name SvgChartsCandlestickChart.init
     * @methodOf svgChartsApp.service:SvgChartsCandlestickChart
     *
     * @description
     * Public access to the GET, PUT, and POST methods
     *
     */
    SvgChartsCandlestickChart.init = function () {

      this.candleStickContainer = SvgChartsScene.svgContent.append('g')
        .attr('name', 'candleStickBars');
    };





    /**
     * @ngdoc function
     * @name SvgChartsCandlestickChart.cleanUp
     * @methodOf svgChartsApp.service:SvgChartsCandlestickChart
     *
     * @description
     * Remove the svg items
     *
     */
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





    /**
     * @ngdoc function
     * @name SvgChartsCandlestickChart.render
     * @methodOf svgChartsApp.service:SvgChartsCandlestickChart
     *
     * @description
     * Render the candlestick data
     *
     */
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


    /**
     * @ngdoc function
     * @name SvgChartsLineChart.init
     * @methodOf svgChartsApp.service:SvgChartsLineChart
     *
     * @description
     * Render svg items
     *
     */
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


    /**
     * @ngdoc function
     * @name SvgChartsLineChart.cleanUp
     * @methodOf svgChartsApp.service:SvgChartsLineChart
     *
     * @description
     * Render svg items
     *
     */
    SvgChartsLineChart.cleanUp = function() {
      SvgChartsLineChart.chartArea.attr('d', function() {});
      SvgChartsLineChart.chartLine.attr('d', function() {});
    };


    /**
     * @ngdoc function
     * @name SvgChartsLineChart.render
     * @methodOf svgChartsApp.service:SvgChartsLineChart
     *
     * @description
     * Render svg items
     *
     */
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
      //
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


    /**
     * @ngdoc function
     * @name SvgChartsKagiChart.cleanUp
     * @methodOf svgChartsApp.service:SvgChartsKagiChart
     *
     * @description
     * Render svg items
     *
     */
    SvgChartsKagiChart.init = function() {
      this.kagiLine = SvgChartsScene.svgContent.append('path').attr('name', 'kagiLine');
    };


    /**
     * @ngdoc function
     * @name SvgChartsKagiChart.cleanUp
     * @methodOf svgChartsApp.service:SvgChartsKagiChart
     *
     * @description
     * Render svg items
     *
     */
    SvgChartsKagiChart.cleanUp = function() {
      this.kagiLine.attr('d', function() {});
    };


    /**
     * @ngdoc function
     * @name SvgChartsKagiChart.cleanUp
     * @methodOf svgChartsApp.service:SvgChartsKagiChart
     *
     * @description
     * Render svg items
     *
     */
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
  .factory('SvgChartsPopover', function (SvgChartsScene) {

    var SvgChartsPopover = {};

    SvgChartsPopover.open = function(_d) {

      var popoverTextBoxWidth = 135;
      var popoverTextBoxHeight = 120;
      var popoverTextBoxX;
      var popoverTextBoxY;

        var m = d3.mouse(SvgChartsScene.svg.node());

        popoverTextBoxX = m[0];
        popoverTextBoxY = m[1];

        if(popoverTextBoxY + popoverTextBoxHeight > SvgChartsScene.height) {
          popoverTextBoxY = popoverTextBoxY - popoverTextBoxHeight;
        }

        if(popoverTextBoxX + popoverTextBoxWidth > SvgChartsScene.width) {
          popoverTextBoxX = popoverTextBoxX - popoverTextBoxWidth;
        }

        SvgChartsScene.popoverTextBox
          .attr('x', popoverTextBoxX)
          .attr('y', popoverTextBoxY)
          .attr('rx', 6)
          .attr('ry', 6)
          .attr('width', popoverTextBoxWidth)
          .attr('height', popoverTextBoxHeight)
          .attr('fill', 'rgba(0,0,0,0.34)')
          .attr({
            'stroke': 'black',
            'stroke-width': '1px'
          });

        SvgChartsScene.popoverText
          .attr('x', popoverTextBoxX)
          .attr('y', popoverTextBoxY + 12)
          .attr('class', 'popover-text')
          .attr('name', 'popover-text')
          .text( function () {
            return  ('0' + (_d.date.getMonth() + 1)).slice(-2) + '/' + ('0' + (_d.date.getDate())).slice(-2) + '/' + _d.date.getFullYear() +
              ' O: ' + parseFloat(Math.round(_d.open * 1000) / 1000).toFixed(3) +
              ' H: ' + parseFloat(Math.round(_d.high * 1000) / 1000).toFixed(3) +
              ' L: ' + parseFloat(Math.round(_d.low * 1000) / 1000).toFixed(3) +
              ' C: ' + parseFloat(Math.round(_d.close * 1000) / 1000).toFixed(3); })
          .attr('font-family', 'sans-serif')
          .attr('font-size', '20px')
          .attr('fill', 'white')
          .call(wrap, 105, popoverTextBoxX + 4);

        SvgChartsScene.popoverTextBoxCloseText
          .attr('x', popoverTextBoxX + popoverTextBoxWidth - 20 + 5)
          .attr('y', popoverTextBoxY + 20 - 4)
          .text('X');

        SvgChartsScene.popoverTextBoxClose
          .attr('x', popoverTextBoxX + popoverTextBoxWidth - 20 + 2)
          .attr('y', popoverTextBoxY + 2)
          .attr('rx', 6)
          .attr('ry', 6)
          .attr('width', 16)
          .attr('height', 16)
          .attr('fill', 'red')
          .attr({
            'stroke': 'black',
            'stroke-width': '1px'
          })
          .attr('style', 'fill-opacity:0.3; cursor: pointer;')
          .on('click', function() {
            SvgChartsPopover.cleanUpPopovers(true);
          });
    };


    SvgChartsPopover.cleanUpPopovers = function(override) {

      if(!override &&
        SvgChartsScene.chartData &&
        SvgChartsScene.$previousChartData &&
        (SvgChartsScene.$previousChartData.length === SvgChartsScene.chartData.length) &&
        (angular.equals(SvgChartsScene.$previousChartData[0], SvgChartsScene.chartData[0]))) {
        return false;
      }

      SvgChartsScene.popoverTextBox.attr('x', -500);
      SvgChartsScene.popoverTextBoxClose.attr('x', -500);

      SvgChartsScene.popoverText.text('');
      SvgChartsScene.popoverTextBoxCloseText.text('');

      SvgChartsScene.$previousChartData = SvgChartsScene.chartData;

    };


    var wrap = function(text, width, popoverTextBoxX) {
      text.each(function() {
        var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr('y'),
          dy = parseFloat(text.attr('dy')),
          tspan = text.text(null).append('tspan').attr('x', popoverTextBoxX + 3).attr('y', parseInt(y) + 20).attr('dy', 0 + 'em');
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(' '));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(' '));
            line = [word];
            tspan = text.append('tspan').attr('x', popoverTextBoxX + 3).attr('y', parseInt(y) + 20).attr('dy', ++lineNumber + 'em').text(word);
          }
        }
      });
    };

    /**
     * @ngdoc function
     * @name svgChartsPopover.init
     * @methodOf svgChartsApp.service:svgChartsPopover
     *
     * @description
     * Initiate the popover svg elements
     *
     */
    SvgChartsPopover.init = function() {
      SvgChartsScene.popoverTextBox = SvgChartsScene.svg.append('rect');
      SvgChartsScene.popoverText = SvgChartsScene.svg.append('text');
      SvgChartsScene.popoverTextBoxCloseText = SvgChartsScene.svg.append('text');
      SvgChartsScene.popoverTextBoxClose = SvgChartsScene.svg.append('rect');
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
  .factory('SvgChartsExtras', function (SvgChartsScene, SvgChartsPopover) {

    var SvgChartsExtras = {};


    /**
     * @ngdoc function
     * @name movingAvg
     * @methodOf svgChartsApp.service:SvgChartsExtras
     *
     * @description
     * Render svg items
     *
     */
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


    /**
     * @ngdoc function
     * @name SvgChartsExtras.cleanUp
     * @methodOf svgChartsApp.service:SvgChartsExtras
     *
     * @description
     * Render svg items
     *
     */
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



    /**
     * @ngdoc function
     * @name SvgChartsExtras.movingAverageCleanup
     * @methodOf svgChartsApp.service:SvgChartsExtras
     *
     * @description
     * Render svg items
     *
     */
    SvgChartsExtras.movingAverageCleanup = function () {
      this.movingAvgLine.attr('d', function () {
      });
    };


    /**
     * @ngdoc function
     * @name SvgChartsExtras.renderMovingAverage
     * @methodOf svgChartsApp.service:SvgChartsExtras
     *
     * @description
     * Render svg items
     *
     */
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


    /**
     * @ngdoc function
     * @name SvgChartsExtras.renderBollingerBands
     * @methodOf svgChartsApp.service:SvgChartsExtras
     *
     * @description
     * Render svg items
     *
     */
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


    /**
     * @ngdoc function
     * @name SvgChartsExtras.bollingerBandsCleanup
     * @methodOf svgChartsApp.service:SvgChartsExtras
     *
     * @description
     * Render svg items
     *
     */
    SvgChartsExtras.bollingerBandsCleanup = function () {
      // Remove the bollinger bands high
      this.bollingerBandHigh.attr('d', function () {});
      // Remove the bollinger bands high
      this.bollingerBandLow.attr('d', function () {});
      // Remove the bollinger bands area
      this.bollingerBandArea.attr('d', function () {});
    };


    /**
     * @ngdoc function
     * @name SvgChartsExtras.cleanUpDataPoints
     * @methodOf svgChartsApp.service:SvgChartsExtras
     *
     * @description
     * Render svg items
     *
     */
    SvgChartsExtras.cleanUpDataPoints = function () {
      this.chartPlotPoints.selectAll('.data-points').remove();
    };


    /**
     * @ngdoc function
     * @name SvgChartsExtras.renderDataPoints
     * @methodOf svgChartsApp.service:SvgChartsExtras
     *
     * @description
     * Render data points
     *
     */
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
          SvgChartsPopover.open(d);
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
     * @methodOf svgChartsApp.service:SvgChartsAxis
     *
     * @description
     * Create svg items
     *
     */
    SvgChartsAxis.init = function () {
      // Create container items
      SvgChartsAxis.xAxis = SvgChartsScene.svgContent.append('g').attr('name', 'xAxis');
      SvgChartsAxis.yAxis = SvgChartsScene.svgContent.append('g').attr('name', 'yAxis');
      SvgChartsAxis.horizontalGrid = SvgChartsScene.svgContent.append('g').attr('name', 'horizontalGrid');
      SvgChartsAxis.verticalGrid = SvgChartsScene.svgContent.append('g').attr('name', 'verticalGrid');
    };





    /**
     * @ngdoc function
     * @name SvgChartsAxis.renderXYAxis
     * @methodOf svgChartsApp.service:SvgChartsAxis
     *
     * @description
     * Render the X and Y Axis
     *
     * @param {String} backgroundColor of the background
     * @param {String} fontColor of the font color
     */
    SvgChartsAxis.renderXYAxis = function (backgroundColor, fontColor) {
      // Scale the x axis and position it on the bottom
      var xAxis = d3.svg.axis()
        .scale(SvgChartsScene.x)
        .orient('bottom');
      // Calculate how many ticks to show
      xAxis.ticks(SvgChartsScene.width / 120);
      // Scale the y axis and position it to the right
      var yAxis = d3.svg.axis()
        .scale(SvgChartsScene.y)
        .orient('right');
      // Calculate how many ticks to show
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
     */
    SvgChartsSubPlot.cleanUp =function() {
      this.subPlotPoints.selectAll('.subplot-points').remove();
    };


    /**
     * @ngdoc function
     * @name SvgChartsSubPlot.renderSubPlots
     * @methodOf svgChartsApp.service:SvgChartsSubPlot
     *
     * @description
     * Public access to the GET, PUT, and POST methods
     *
     */
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
        // .transition()
        // .duration(500)
        // .ease("linear")
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
