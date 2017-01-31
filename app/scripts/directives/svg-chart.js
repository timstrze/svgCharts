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
