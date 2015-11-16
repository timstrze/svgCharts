'use strict';

describe('Service: Svgchartspopover', function () {

  // load the service's module
  beforeEach(module('svgChartsApp'));

  // instantiate service
  var Svgchartspopover;
  var testData = angular.copy(window.testData);

  beforeEach(inject(function (_Svgchartspopover_) {
    Svgchartspopover = _Svgchartspopover_;
  }));

  describe('Svgchartspopover.http', function () {

    it('Svgchartspopover should exist', function () {
      expect(Svgchartspopover.http).not.toBeUndefined();
    });

  });

});
