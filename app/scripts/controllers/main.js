'use strict';

/**
 * @ngdoc function
 * @name svgChartsApp.controller:MainController
 * @description
 * # MainController
 * Controller of the svgChartsApp
 */
angular.module('svgChartsApp')
  .controller('MainController', function ($http, Constants) {

    this.Constants = Constants;

    this.getSelectedSymbol = function (startDate, endDate) {

    };

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
    this.init = function () {
      var _this = this;
      this.symbol = {};
      this.selectedSymbol = 'aapl';
      this.selectedChart = 'candlestick-chart';
      this.selectedExtras = ['moving-average'];

      $http.get('json/historical-data.json').then(function(results) {
        _this.symbol.historicalData = results.data.query.results.quote;
      });
    };



    /**
     * @description
     * Initiates the controller.
     *
     */
    this.init();

  });
