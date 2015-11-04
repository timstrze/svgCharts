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
      $scope.selectedChart = 'line-chart';
      $scope.selectedExtras = [];

      $http.get('json/historical-data.json').then(function(results) {
        $scope.symbol.historicalData = results.data.query.results.quote;
      });
    };



    /**
     * @ngdoc function
     * @name MainController.clickButton
     * @module Main
     * @methodOf svgChartsApp.controller:MainController
     * @kind function
     *
     * @description
     * Alerts user after clicking button
     *
     * @returns {Object} Returns event Object
     *
     */
    $scope.clickButton = function (event) {
      // Alerts the user
      //alert(1);
      return event;
    };



    /**
     * @ngdoc function
     * @name MainController.loader_show
     * @module Main
     * @eventOf svgChartsApp.controller:MainController
     * @kind event
     *
     * @description
     * Watching the loading flag for true.
     *
     */
    $scope.$on('loader_show', function () {
      $scope.isLoading = true;
    });




    /**
     * @ngdoc function
     * @name MainController.loader_hide
     * @module Main
     * @eventOf svgChartsApp.controller:MainController
     * @kind event
     *
     * @description
     * Watching the loading flag for false.
     *
     */
    $scope.$on('loader_hide', function () {
      $scope.isLoading = false;
    });




    /**
     * @description
     * Initiates the controller.
     *
     */
    $scope.init();

  });
