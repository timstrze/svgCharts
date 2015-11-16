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
    'ngTouch',
    'ngMaterial',
    'ngMdIcons'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/svg-charts/demo', {
        templateUrl: 'views/routes/main.html',
        controller: 'DemoController',
        controllerAs: 'ctrl'
      });
  });
