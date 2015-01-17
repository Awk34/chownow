'use strict';

angular.module('hackshareApp')
    .controller('MainCtrl', function ($scope, $http, socket, geoFactory) {
        $scope.awesomeThings = [];
        $scope.hacks = [];

        $http.get('/api/things').success(function (awesomeThings) {
            $scope.awesomeThings = awesomeThings;
            socket.syncUpdates('thing', $scope.awesomeThings);
        });

        $http.get('/api/hacks').success(function (hacks) {
            $scope.hacks = hacks;
            socket.syncUpdates('hack', $scope.hacks);
        });

        $scope.addThing = function () {
            if ($scope.newThing === '') {
                return;
            }
            $http.post('/api/things', {name: $scope.newThing});
            $scope.newThing = '';
        };

        $scope.addHack = function () {
            if ($scope.newThing === '') {
                return;
            }
            $http.post('/api/things', {name: $scope.newThing});
            $scope.newThing = '';
        };

        $scope.deleteThing = function (thing) {
            $http.delete('/api/things/' + thing._id);
        };

        $scope.$on('$destroy', function () {
            socket.unsyncUpdates('thing');
        });
    });
