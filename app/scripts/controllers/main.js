'use strict';

/**
 * @ngdoc function
 * @name svgChartsApp.controller:MainController
 * @description
 * # MainController
 * Controller of the svgChartsApp
 */
angular.module('svgChartsApp')
  .controller('MainController', function ($scope, $http) {


    /**
     * @ngdoc function
     * @name MainController.init
     * @module Main
     * @methodOf svgChartsApp.controller:MainController
     * @kind function
     *
     * @description
     * Initiates the controller
     *
     */
    $scope.init = function () {
      // Alerts the user
      //alert(1);
      $scope.symbol = {};
      $scope.selectedChart = 'candlestick-chart';
      $scope.selectedExtras = [];

      $http.get('json/historical-data.json').then(function(results) {
        $scope.symbol.historicalData = results.data.query.results.quote;
      });
    };



    /**
     * @description
     * Initiates the controller.
     *
     */
    $scope.init();

  });
