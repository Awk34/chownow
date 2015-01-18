'use strict';

angular.module('hackshareApp')
    .controller('MainCtrl', function ($scope, $http, socket) {
        $scope.hacks = [];
        $scope.recentHacks = [];
        console.log(socket);

        $scope.$watch('hacks', function() {

        });

        $http.get('/api/hacks').success(function (hacks) {
            $scope.hacks = hacks;
            socket.syncUpdates('hack', $scope.hacks);
        });

        $scope.addHack = function () {

        };

        $scope.$on('$destroy', function () {
            socket.unsyncUpdates('hack');
        });
    });
