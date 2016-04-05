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
    'ngMaterial',
    'ngMdIcons'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/svg-charts/demo', {
        templateUrl: 'views/demo/demo.html',
        controller: 'DemoController',
        controllerAs: 'ctrl'
      });
  });
