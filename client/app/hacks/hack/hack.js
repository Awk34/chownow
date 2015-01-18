'use strict';

angular.module('hackshareApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('hack', {
                url: '/hacks/:hackId',
                templateUrl: 'app/hacks/hack/hack.html',
                controller: 'HackCtrl'
            });
    });
