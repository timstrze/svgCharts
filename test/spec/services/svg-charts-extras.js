'use strict';

describe('Service: SvgChartsExtras', function () {

  // load the service's module
  beforeEach(module('svgChartsApp'));

  // instantiate service
  var SvgChartsExtras;
  var testData = angular.copy(window.testData);

  beforeEach(inject(function (_SvgChartsExtras_) {
    SvgChartsExtras = _SvgChartsExtras_;
  }));

  describe('SvgChartsExtras.http', function () {

    it('SvgChartsExtras should exist', function () {
      expect(SvgChartsExtras.http).not.toBeUndefined();
      expect(testData).not.toBeUndefined();
    });

  });

});
