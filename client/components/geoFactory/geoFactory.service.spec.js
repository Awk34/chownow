'use strict';

describe('Service: geoFactory', function () {

    // load the service's module
    beforeEach(module('hackshareApp'));

    // instantiate service
    var geoFactory;
    beforeEach(inject(function (_geoFactory_) {
        geoFactory = _geoFactory_;
    }));

    it('should do something', function () {
        expect(!!geoFactory).toBe(true);
    });

});
