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
  .directive('svgChart', function ($window, $mdMedia, SvgChartsScene, SvgChartsAxis, LineChart, OHLCChart, SvgChartsExtras) {
    return {
      scope: {
        chartData: '=',
        selectedExtras: '=',
        selectedChart: '=',
        subPlots: '='
      },
      template: '<svg class="svg-chart"><g name="svgContent" class="svg-chart-content"></g></svg>',
      link: function postLink($scope, element) {



        SvgChartsScene.init(element);



        // Line chart elements
        LineChart.init();



        //
        SvgChartsExtras.init();




        // Axis
        SvgChartsAxis.init();











        // Functions
        $scope.formatData = function () {

          // Format the historical data for d3
          SvgChartsScene.chartData.forEach(function (d) {
            d.date = d3.time.format('%Y-%m-%d').parse(d.Date);
            d.close = +d.Close;
            d.low = +d.Low;
          });
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





        $scope.renderPositions = function () {
          //var positions;
          //
          //// Loop over the Positions
          //angular.forEach($scope.positions, function (position) {
          //  // Check to see if Symbols match
          //  if (position.Symbol.Symbol.toLowerCase() === $scope.symbol.Symbol.toLowerCase()) {
          //    positions = position;
          //  }
          //});

          //if(positions) {
          //  var x = d3.time.scale()
          //    .range([0, $scope.width]);
          //
          //  var y = d3.scale.linear()
          //    .range([$scope.height, 0]);
          //
          //  //var g = $scope.svg.append('g');
          //  //
          //  //var img = g.append('svg:image')
          //  //  .attr('xlink:href', './images/icons/buy.svg')
          //  //  .attr('width', 50)
          //  //  .attr('height', 50)
          //  //  .attr('x', 228)
          //  //  .attr('y',53);
          //
          //
          //  $scope.svgContent.selectAll('circle').remove();
          //  $scope.svgContent.selectAll('circle')
          //    .data(positions.buys)
          //    .enter()
          //    .append('circle')
          //    .attr('cx', function(d, i) {
          //      return x($scope.parseDate(d.created.split(' ')[0]));
          //    })
          //    .attr('cy', function (d) {
          //      return y(d.ask);
          //    })
          //
          //    .attr('r', function(d) {
          //      return 10;
          //    })
          //    .attr('fill', '#3F51B5')
          //    .attr('stroke', '#fff');
          //
          //  //$scope.svg.selectAll('text').remove();
          //  //$scope.svg.selectAll('text')
          //  //  .data(positions.buys)
          //  //  .enter()
          //  //  .append('text')
          //  //  .attr('x', function(d, i) {
          //  //    return x($scope.parseDate(d.created.split(' ')[0]));
          //  //  })
          //  //  .attr('y', function (d) {
          //  //    return y(d.ask);
          //  //  })
          //  //  .text(function(d) {
          //  //    return d.ask;
          //  //  });
          //
          //}else{
          //  //$scope.svg.selectAll('text').remove();
          //  $scope.svgContent.selectAll('circle').remove()
          //}
        };









        $scope.renderXYAxis = function () {


          var xAxis = d3.svg.axis()
            .scale(SvgChartsScene.x)
            .orient('bottom');


          //.innerTickSize(-$scope.height)
          //.outerTickSize(0)
          //.tickPadding(10);

          // Only toggle the modal if small size
          if ($mdMedia('sm') || $mdMedia('md')) {
            xAxis.ticks(5);
          }

          var yAxis = d3.svg.axis()
            .scale(SvgChartsScene.y)
            .orient('right');


          //.innerTickSize(-$scope.width)
          //.outerTickSize(0)
          //.tickPadding(10);


          $scope.xAxis
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + (SvgChartsScene.height) + ')')
            .call(xAxis)
            .attr({
              'fill': 'none',
              'shape-rendering': 'crispEdges',
              'stroke': 'rgba(0,0,0,0.54)'
            });


          $scope.yAxis
            .attr('class', 'y axis')
            .attr('transform', 'translate(' + (SvgChartsScene.width) + ',0)')
            .call(yAxis)
            .attr({
              'fill': 'none',
              'shape-rendering': 'crispEdges',
              'stroke': 'rgba(0,0,0,0.54)'
            });


          //$scope.yAxisLines
          //  //.attr('transform', 'translate(-20,'+h+')')
          //  .call(d3.svg.axis()
          //    .scale(xAxis)
          //    .orient('bottom')
          //    .ticks(4)
          //    .tickSize(-$scope.height,0,0)
          //    .tickFormat('')
          //)

          $scope.horizontalGrid.selectAll('line').remove();

          var horizontalGridLine =  $scope.horizontalGrid.selectAll('line').data(SvgChartsScene.y.ticks(4));

          horizontalGridLine
            .enter()
            .append('line')
            .attr(
            {
              'class': 'horizontalGrid',
              'x1': 0,
              'x2': SvgChartsScene.width,
              'y1': function (d) {
                return SvgChartsScene.y(d);
              },
              'y2': function (d) {
                return SvgChartsScene.y(d);
              },
              'fill': 'none',
              'shape-rendering': 'crispEdges',
              'stroke': '#C7C7C7',
              'stroke-width': '1px',
              'stroke-dasharray': '5, 5'
            });

          horizontalGridLine.exit().remove();

          $scope.verticalGrid.selectAll('line').remove();

          var verticalGridLine = $scope.verticalGrid.selectAll('line')
            .data(SvgChartsScene.x.ticks(12));

          verticalGridLine
            .enter()
            .append('line')
            .attr(
            {
              'class': 'verticalGrid',
              'x1': function (d) {
                return SvgChartsScene.x(d);
              },
              'x2': function (d) {
                return SvgChartsScene.x(d);
              },
              'y1': -SvgChartsScene.margin.top,
              'y2': SvgChartsScene.height,
              'fill': 'none',
              'shape-rendering': 'crispEdges',
              'stroke': '#C7C7C7',
              'stroke-width': '1px',
              'stroke-dasharray': '5, 5'
            });

          verticalGridLine.exit().remove();

          $scope.xAxis.selectAll('text').attr('style', 'fill:rgba(0,0,0,0.54);').attr('stroke-width', '0px');
          $scope.yAxis.selectAll('text').attr('style', 'fill:rgba(0,0,0,0.54);').attr('stroke-width', '0px');




        };























        $scope.render = function () {

          // Make a reference to the data
          SvgChartsScene.chartData = $scope.chartData;

          $scope.formatData();
          $scope.resizeScene();

          if ($scope.selectedChart === 'ohlc-chart') {
            OHLCChart.cleanUp();
            LineChart.cleanUp();
            OHLCChart.render();
          } else if ($scope.selectedChart === 'candlestick-chart') {
            OHLCChart.cleanUp();
            LineChart.cleanUp();
            OHLCChart.render(true);
          } else {
            OHLCChart.cleanUp();
            LineChart.render();
          }





          //if($scope.selectedExtras && $scope.selectedExtras.toString().indexOf('moving-average') > -1) {
          //  $scope.renderMovingAverage();
          //}else{
          //  $scope.movingAvgLine.attr('d', function() {});
          //}
          //
          //if($scope.selectedExtras && $scope.selectedExtras.toString().indexOf('bollinger-bands') > -1) {
          //  $scope.renderBollingerBands();
          //}else{
          //  $scope.bollingerBandHigh.attr('d', function() {});
          //  $scope.bollingerBandLow.attr('d', function() {});
          //  $scope.bollingerBandArea.attr('d', function() {});
          //}






          $scope.renderXYAxis();

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
            return JSON.stringify([$scope.chartData, $scope.selectedChart, $scope.selectedExtras]);
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
