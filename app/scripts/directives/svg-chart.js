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

          // if (type === 'dark') {

            SvgChartsScene.svg.attr('style', 'background-color:' + backgroundColor);

            SvgChartsAxis.xAxis.selectAll('text').attr('style', 'fill:' + fontColor);
            SvgChartsAxis.yAxis.selectAll('text').attr('style', 'fill:' + fontColor);

            SvgChartsLineChart.gradientStart.attr('stop-color', backgroundColor);


          // } else {
          //   SvgChartsScene.svg.attr('style', 'background-color:#fff');
          //
          //   SvgChartsAxis.xAxis.selectAll('text').attr('style', 'fill:rgba(0,0,0,0.54);');
          //   SvgChartsAxis.yAxis.selectAll('text').attr('style', 'fill:rgba(0,0,0,0.54);');
          //
          //   SvgChartsLineChart.gradientStart.attr('stop-color', '#fff');
          //
          // }

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


          SvgChartsAxis.renderXYAxis();


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
