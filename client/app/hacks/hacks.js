'use strict';

angular.module('hackshareApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('hacks', {
                url: '/hacks',
                templateUrl: 'app/hacks/hacks.html',
                controller: 'HacksCtrl'
            })
            .state('hacks.hack', {
                url: '/:hackId',
                templateUrl: 'app/hacks/hack/hack.html',
                controller: 'HackCtrl'
            });
    });
