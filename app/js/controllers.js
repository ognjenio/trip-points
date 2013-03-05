'use strict';

/* Controllers */


function IndexController($scope) {
  $scope.places = [];
  $scope.addPlace = function(){
    var newPlace = new google.maps.LatLng($scope.placeLat, $scope.placeLong);
    newPlace.name = $scope.placeName;
    
    $scope.places.push(newPlace);
    $scope.placeLat = $scope.placeLong = $scope.placeName = '';
    $scope.generateDistances();    
  }
  $scope.reset = function(){
    $scope.places = [];
    $scope.distances = []; 
    $scope.flightPath.setMap(null);
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
      $scope.flightPath = new google.maps.Polyline({
        path: $scope.places,
        strokeColor: "#0000FF",
        strokeOpacity: 0.8,
        strokeWeight: 2
      });
      $scope.flightPath.setMap($scope.map);
    }        
  };
  
  $scope.seed = function(){
    var x = new google.maps.LatLng(52.395715, 4.888916);
    x.name = "Amsterdam";
    var kl = new google.maps.LatLng(3.1475, 101.693333);
    kl.name = "Kuala Lumpur";
    
    $scope.places.push(x);
    $scope.places.push(kl);

    $scope.generateDistances();
    
    
    console.log($scope.places);
  };
  
  $scope.generateDistances = function(){
    $scope.distances = {}
    if ($scope.places.length > 1)
    {
       for (var i = 0; i < $scope.places.length; i++)
       {
          var current = $scope.places[i];
          $scope.distances[current.name] = {}  
          for (var j = 0; j < $scope.places.length; j++)
          {
             var destination = $scope.places[j]
             if (current != destination)
             {
                $scope.distances[current.name][destination.name] = 
                  $scope.calculateDistance(current, destination);
             }
          }
       }
       console.log($scope.distances)
    }
    else
    {
      console.log("Not enough places.")
    }
    
  };
  
  $scope.rad = function(x) {return x*Math.PI/180;}
  
  $scope.calculateDistance = function(p1, p2){
    //http://stackoverflow.com/questions/1502590/calculate-distance-between-two-points-in-google-maps-v3
    var R = 6371; // earth's mean radius in km
    var dLat  = $scope.rad(p2.lat() - p1.lat());
    var dLong = $scope.rad(p2.lng() - p1.lng());
  
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos($scope.rad(p1.lat())) * Math.cos($scope.rad(p2.lat())) * Math.sin(dLong/2) * Math.sin(dLong/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
  
    return d.toFixed(3);
  };
  
  $scope.sortPlaces = function(){
    // gather all markers on map
    // build hash of all points with all other points
    // $scope.adjacency = {i: {i+1: 0, i-1: 0}}   
    // go through the adjacency and calculate the distance
    // between point i and all the other points in it's hash
    // which gives us the adjacency matrix
  };
  
}
IndexController.$inject = ["$scope"];
