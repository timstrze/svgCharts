'use strict';

/**
 * @ngdoc service
 * @name svgChartsApp.service:svgChartsPopover
 * @description
 * # svgChartsPopover
 * Factory that contains all the properties and methods for a svgChartsPopover
 *
 */
angular.module('svgChartsApp')
  .factory('svgChartsPopover', function ($resource) {

    var svgChartsPopover = function (properties) {
      // Create a reference to this
      var _this = this;
      // Loop over the keys of the object passed in
      Object.keys(properties).forEach(function (property) {
        // Set the properties of this Object
        _this[property] = properties[property];
      });
    };





    /**
     * @ngdoc function
     * @name svgChartsPopover.http
     * @methodOf svgChartsApp.service:svgChartsPopover
     *
     * @description
     * Public access to the GET, PUT, and POST methods
     *
     * @param {String} ID of the svgChartsPopover
     */
    svgChartsPopover.http = $resource('json/svg-charts-pop-over.json/:id', {
      id: '@id'
    }, {
      get: {
        method: 'GET'
      }
    });


    return svgChartsPopover;

  });
