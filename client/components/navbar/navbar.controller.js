'use strict';

angular.module('hackshareApp')
    .controller('NavbarCtrl', function ($rootScope, $scope, $location, Auth, geoFactory, $mdDialog) {
        $scope.menu = [{
            'title': 'Home',
            'link': '/'
        }];

        geoFactory.getPosition().then(function(position) {
            geoFactory.getLocation(position);
        }, function() {
            console.log('failed');
        });

        $scope.isCollapsed = true;
        $scope.isLoggedIn = Auth.isLoggedIn;
        $scope.isAdmin = Auth.isAdmin;
        $scope.getCurrentUser = Auth.getCurrentUser;

        $scope.logout = function () {
            Auth.logout();
            $location.path('/login');
        };

        $scope.isActive = function (route) {
            return route === $location.path();
        };

        $scope.showConfirm = function(ev) {
            var confirm = $mdDialog.confirm()
                .title('Would you like to delete your debt?')
                .content('All of the banks have agreed to forgive you your debts.')
                .ariaLabel('Lucky day')
                .ok('Please do it!')
                .cancel('Sounds like a scam')
                .targetEvent(ev);
            $mdDialog.show(confirm).then(function() {
                $scope.alert = 'You decided to get rid of your debt.';
            }, function() {
                $scope.alert = 'You decided to keep your debt.';
            });
        };
    });
