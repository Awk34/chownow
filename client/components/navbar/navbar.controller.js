'use strict';

angular.module('hackshareApp')
    .controller('NavbarCtrl', function ($rootScope, $scope, $location, Auth, geoFactory, $mdDialog, $http) {
        $scope.menu = [{
            'title': 'Home',
            'link': '/'
        }];

        $scope.city = null;
        $scope.firstLocation = null;
        $scope.deliverability = 'unknown';

        geoFactory.getPosition().then(function(position) {
            geoFactory.getLocation(position).then(function(results) {
                console.log(results);
                $scope.firstLocation = results[1];
                console.log($scope.firstLocation['formatted_address']);
                _.forEach(results[1]['address_components'], function(component) {
                    if(_.contains(component.types, 'locality')) {
                        console.log(component);
                        $scope.city = component['short_name'];
                    }
                });
                $http.post('/api/postmates/quote', {
                    pickup_address: $scope.firstLocation['formatted_address'],
                    dropoff_address: $scope.firstLocation['formatted_address']
                    //pickup_address: '113 my kentucky rose cir, simpsonville, ky 40067',
                    //dropoff_address: '113 my kentucky rose cir, simpsonville, ky 40067'
                })
                    .success(function(results) {
                        if(results.kind === 'error') {
                            $scope.deliverability = 'bad';
                        } else if(results.kind === 'delivery_quote') {
                            $scope.deliverability = 'good';
                        } else {
                            console.log('whut is dis');
                        }
                        console.log(results);
                    });
            }, function(results) {
                console.log('failed because '+status);
            })
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

        var setLocation = function() {

        };
    });
