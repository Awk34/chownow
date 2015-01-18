'use strict';

angular.module('hackshareApp')
    .controller('MainCtrl', function ($scope, $http, socket) {
        $scope.hacks = [];
        console.log(socket);

        $http.get('/api/hacks').success(function (hacks) {
            $scope.hacks = hacks;
            socket.syncUpdates('hack', $scope.hacks);
        });

        $scope.addHack = function () {
            if ($scope.newThing === '') {
                return;
            }
            $http.post('/api/things', {name: $scope.newThing});
            $scope.newThing = '';
        };

        $scope.$on('$destroy', function () {
            socket.unsyncUpdates('hack');
        });
    });
