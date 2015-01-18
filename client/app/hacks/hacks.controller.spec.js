'use strict';

describe('Controller: HacksCtrl', function () {

    // load the controller's module
    beforeEach(module('hackshareApp'));

    var HacksCtrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        HacksCtrl = $controller('HacksCtrl', {
            $scope: scope
        });
    }));

    it('should ...', function () {
        expect(1).toEqual(1);
    });
});
