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



    /**
     * @ngdoc property
     * @name DemoController.Constants
     * @module Demo
     * @propertyOf svgChartsApp.controller:DemoController
     *
     * @description
     * Make the Constants Service available to the templates
     *
     */
    this.Constants = Constants;


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
      // Get the symbols
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
