'use strict';

angular.module('hackshareApp')
    .controller('AdminCtrl', function ($scope, $http, Auth, User) {
        // Use the User $resource to fetch all users
        $scope.users = User.query();

        $scope.delete = function (user) {
            User.remove({id: user._id});
            angular.forEach($scope.users, function (u, i) {
                if (u === user) {
                    $scope.users.splice(i, 1);
                }
            });
        };

        $scope.pages = [
            {
                name: 'Users',
                icon: 'fa-user',
                link: 'admin/users'
            }, {
                name: 'Hacks',
                icon: 'fa-code',
                link: 'admin/hacks'
            }, {
                name: 'Settings',
                icon: 'fa-cog',
                link: 'admin/settings'
            }
        ];
    });
