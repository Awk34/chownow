'use strict';

describe('Controller: HackCtrl', function () {

    // load the controller's module
    beforeEach(module('hackshareApp'));

    var HackCtrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        HackCtrl = $controller('HackCtrl', {
            $scope: scope
        });
    }));

    it('should ...', function () {
        expect(1).toEqual(1);
    });
});
