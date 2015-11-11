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

    this.getSelectedSymbol = function (Symbol) {

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
      this.selectedChart = 'candlestick-chart';
      this.selectedExtras = ['moving-average'];

      $http.get('json/symbols.json').then(function(results) {
        _this.Symbols = results.data.quote;
        _this.selectedSymbol = _this.Symbols[0];

      });
    };



    /**
     * @description
     * Initiates the controller.
     *
     */
    this.init();

  });
