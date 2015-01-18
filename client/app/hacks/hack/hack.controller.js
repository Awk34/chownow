'use strict';

angular.module('hackshareApp')
    .controller('HackCtrl', function ($rootScope, $scope, $http, $stateParams, geoFactory, Auth) {
        $scope.hackId = $stateParams.hackId;
        $scope.quoteFee = '?';
        $scope.estimatedArrival = '?';

        $http.get('/api/hacks/'+$stateParams.hackId)
            .success(function(hack) {
                $scope.hack = hack;
                $scope.hack.price = $scope.hack.price.toFixed(2);
                console.log(hack);

                var geocoder = new google.maps.Geocoder();
                var latlng = new google.maps.LatLng(40.730885,-73.997383);
                var mapOptions = {
                    zoom: 13,
                    center: latlng
                };
                var map = new google.maps.Map(document.getElementById("map-container"), mapOptions);

                var address = $scope.hack.address;
                geocoder.geocode( { 'address': address}, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        map.setCenter(results[0].geometry.location);
                        var marker = new google.maps.Marker({
                            map: map,
                            position: results[0].geometry.location
                        });
                    } else {
                        alert("Geocode was not successful for the following reason: " + status);
                    }
                });

                geoFactory.getPosition().then(function(position) {
                    geoFactory.getLocation(position).then(function (results) {
                        $scope.firstLocation = results[1];
                        $http.post('/api/postmates/quote', {
                            pickup_address: hack.address,
                            dropoff_address: $scope.firstLocation['formatted_address']
                        })
                            .success(function (result) {
                                if (result.kind === 'error') {
                                    console.log('Error getting quote');
                                } else if (result.kind === 'delivery_quote') {
                                    $scope.quote = result;
                                    $scope.quoteFee = (result.fee/100).toFixed(2);
                                    $scope.estimatedArrival = moment(result['dropoff_eta']).format("ddd, h:mm A");
                                    console.log($scope.estimatedArrival);
                                    console.log(result);
                                } else {
                                    console.log('whut is dis');
                                }
                            });
                    });
                });
            })
            .error(function(data, status) {
                $scope.error = status;
            });

        $scope.placeOrder = function() {
            var user = Auth.getCurrentUser();
            console.log(user);
            if(_.isEmpty(user)) {
                alert('You need to log in!');
            }
            $http.post('/api/postmates/order', {
                'manifest'              : $scope.hack.name,
                'pickup_name'           : '',
                'pickup_address'        : '',
                'pickup_phone_number'   : '',
                'pickup_business_name'  : '',
                'pickup_notes'          : '',
                'dropoff_name'          : user.name,
                'dropoff_address'       : user.address,
                'dropoff_phone_number'  : user.phoneNumber,
                'dropoff_notes'         : ''
            })
                .success(function(results) {
                    console.log(results);
                })
                .error(function(err) {
                    console.log(err);
                });
        };
    });
