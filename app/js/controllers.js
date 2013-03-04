'use strict';

/* Controllers */


function IndexController($scope) {
  $scope.places = [];
  $scope.addPlace = function(){
    var newPlace = new google.maps.LatLng($scope.placeLat, $scope.placeLong);
    newPlace.name = $scope.placeName;
    
    $scope.places.push(newPlace);
    $scope.placeLat = $scope.placeLong = $scope.placeName = '';    
  }
  $scope.setMap = function(){
    var mapProp = {
        center: new google.maps.LatLng(52.395715,4.888916),
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
    $scope.map = new google.maps.Map(document.getElementById("mainMap"), mapProp);
  };
  $scope.setPath = function(){
    $scope.sortPlaces();
    if ($scope.places.length > 0)
    {
      var flightPath = new google.maps.Polyline({
        path: $scope.places,
        strokeColor: "#0000FF",
        strokeOpacity: 0.8,
        strokeWeight: 2
      });
      flightPath.setMap($scope.map);
    }        
  };
  
  $scope.seed = function(){
    var x = new google.maps.LatLng(52.395715,4.888916);
    x.name = "Amsterdam";
    var kl = new google.maps.LatLng(3.1475, 101.693333);
    kl.name = "Kuala Lumpur";
    
    $scope.places.push(x);
    $scope.places.push(kl);
  }
  
  $scope.sortPlaces = function(){
    // gather all markers on map
    // build hash of all points with all other points
    // $scope.adjacency = {i: {i+1: 0, i-1: 0}}   
    // go through the adjacency and calculate the distance
    // between point i and all the other points in it's hash
    // which gives us the adjacency matrix
  }
  
}
IndexController.$inject = ["$scope"];
