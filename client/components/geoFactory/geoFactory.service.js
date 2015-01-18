'use strict';

angular.module('hackshareApp')
    .factory('geoFactory', function ($rootScope, $http, $q) {
        // Service logic
        var geocoder;
        var map;
        var infowindow = new google.maps.InfoWindow();
        var marker;
        var initialized = false;
        function initialize() {
            geocoder = new google.maps.Geocoder();
            var latlng = new google.maps.LatLng(40.730885,-73.997383);
            var mapOptions = {
                zoom: 8,
                center: latlng
            };
            //map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
        }

        // Public API here
        return {
            getPosition: function() {
                return $q(function(resolve, reject) {
                    if(!initialized) initialize();
                    if (Modernizr.geolocation) {
                        navigator.geolocation.getCurrentPosition(function (position) {
                            //console.log("Latitude: " + position.coords.latitude +
                            //"\nLongitude: " + position.coords.longitude);

                            $rootScope.location = position;
                            //console.log(position);
                            resolve(position);
                        });
                    } else {
                        // no native support; maybe try a fallback?
                        console.warn('No location support, user must select location manually');
                        reject();
                    }
                })
            }, getLocation: function(position) {
                return $q(function(resolve, reject) {
                    var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    geocoder.geocode({'latLng': latlng}, function(results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            if (results[0]) {
                                //map.setZoom(11);
                                marker = new google.maps.Marker({
                                    position: latlng,
                                    map: map
                                });
                                infowindow.setContent(results[0].formatted_address);
                                //infowindow.open(map, marker);
                                resolve(results);
                            }
                        } else {
                            alert("Geocoder failed due to: " + status);
                            reject(status);
                        }
                    });
                })
            }
        };
    });
