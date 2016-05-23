'use strict';

/**
 * @ngdoc function
 * @name svgChartsApp.controller:DemoController
 * @description
 * # DemoController
 * Controller of the svgChartsApp
 */
angular.module('svgChartsApp')
  .controller('DemoController', function ($http, Constants) {

    this.Constants = Constants;

    this.getSelectedSymbol = function (Symbol) {
      return Symbol;
    };

    /**
     * @ngdoc function
     * @name DemoController.init
     * @module Demo
     * @methodOf svgChartsApp.controller:DemoController
     * @kind function
     *
     * @description
     * Initiates the controller
     *
     */
    this.init = function () {
      var _this = this;
      this.symbol = {};
      this.selectedChart = 'line-chart';
      this.selectedExtras = [];
      this.selectedTheme = Constants.themeTypes[1];

      $http.get('json/symbols.json').then(function (results) {
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
