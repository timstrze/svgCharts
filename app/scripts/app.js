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
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngMaterial',
    'ngMessages',
    'ngMdIcons'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/svg-charts/demo', {
        templateUrl: 'views/routes/main.html',
        controller: 'MainController',
        controllerAs: 'ctrl'
      });
  });



