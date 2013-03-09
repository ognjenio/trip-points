'use strict';

/* Controllers */


function IndexController($scope) {
  $scope.places = [];
  $scope.addPlace = function(){
    var newPlace = new google.maps.LatLng($scope.placeLat, $scope.placeLong);
    newPlace.name = $scope.placeName;
    
    $scope.places.push(newPlace);
    $scope.placeLat = $scope.placeLong = $scope.placeName = '';
    $scope.generateNN();
  }
  $scope.reset = function(){
    $scope.places = [];
    $scope.distances = [];
    $scope.nnsequence = [];
    $scope.flightPath.setMap(null);
    $scope.NNflightPath.setMap(null);
  }
  $scope.setMap = function(){
    var mapProp = {
        center: new google.maps.LatLng(52.395715,4.888916),
        zoom: 1,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
    $scope.map = new google.maps.Map(document.getElementById("mainMap"), mapProp);
    
    $(".tabs a").each(function(){
        $(this).click();
    });
    
  };
  $scope.setPath = function(){
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
  
  $scope.setNNPath = function(){
    if ($scope.nnsequence.length > 0)
    {
      $scope.NNflightPath = new google.maps.Polyline({
        path: $scope.nnsequence,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2
      });
      $scope.NNflightPath.setMap($scope.map);
    }        
  };  
  
  $scope.seed = function(){
    var x = new google.maps.LatLng(52.395715, 4.888916);
    x.name = "Amsterdam";
    
    var kl = new google.maps.LatLng(3.1475, 101.693333);
    kl.name = "Kuala Lumpur";
    
    var l = new google.maps.LatLng(51.507222, -0.1275);
    l.name = "London";
    
    var p = new google.maps.LatLng(48.8567, 2.3508);
    p.name = "Paris";
    
    var q = new google.maps.LatLng(40.4, -3.683333);
    q.name = "Madrid";
    
    var w = new google.maps.LatLng(55.75, 37.616667);
    w.name = "Moscow";
    
    var e = new google.maps.LatLng(28.613889, 77.208889);
    e.name = "Delhi";
    
    var a = new google.maps.LatLng(1.3, 103.8);
    a.name = "Singapore";
    
    var s = new google.maps.LatLng(-6.2, 106.8);
    s.name = "Jakarta";
    
    var d = new google.maps.LatLng(-33.859972, 151.211111);
    d.name = "Sydney";
    
    var z = new google.maps.LatLng(43, -75	);
    z.name = "New York";
    

    
    $scope.places.push(x);
    $scope.places.push(kl);
    $scope.places.push(l);
    $scope.places.push(p);
    $scope.places.push(q);
    $scope.places.push(w);
    $scope.places.push(e);
    $scope.places.push(a);
    $scope.places.push(s);
    $scope.places.push(d);
    $scope.places.push(z);

    $scope.generateNN();
    
    console.log($scope.places);
  };
  
  $scope.generateDistances = function(){
    $scope.distances = {}
    if ($scope.places.length > 1)
    {
       for (var i = 0; i < $scope.places.length; i++)
       {
          var c = $scope.places[i];
          $scope.distances[c.name] = {}  
          for (var j = 0; j < $scope.places.length; j++)
          {
             var destination = $scope.places[j]
             if (c != destination)
             {
                $scope.distances[c.name][destination.name] = 
                  $scope.calculateDistance(c, destination);
             }
          }
       }
       console.log("Distances: ", $scope.distances)
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
  
  $scope.furthestPoint = function(){
    var toret = $scope.places[0].name;
    var toret_val = $scope.places[0].jb;
    
    for (var i = 1; i < $scope.places.length; i++)
    {
       if ($scope.places[i].jb > toret_val)
       {
          toret = $scope.places[i].name;
          toret_val = $scope.places[i].jb;
       }
    }
    
    return toret;
  };
  
  $scope.calcPathDistances = function(path){
    var toret = 0;
    if (typeof(path) != 'undefined')
    {
      for (var i = 0; i < path.length-1; i++)
      {
        toret = toret + parseInt($scope.distances[path[i].name][path[i+1].name])
      }
    }
    return toret;
  };
  
  $scope.nextPoint = function(current){
    var temp_distances = $scope.distances[current];   
    
    var toret = null;
    var toret_val = null;
    
    for (var next_point in temp_distances)
    {
      if (toret == null && $scope.nnsequence.indexOf($scope.findByName(next_point)) == -1)
      {
        toret = next_point;
        toret_val = temp_distances[next_point];
      }
      
      if (parseInt(toret_val) > parseInt(temp_distances[next_point]) && $scope.nnsequence.indexOf($scope.findByName(next_point)) == -1)
      {
        toret = next_point;
        toret_val = temp_distances[next_point];
      }
    }
    
    return toret;
  };
  
  $scope.findByName = function(name){
    for (var i = 0; i < $scope.places.length; i++)
    {
      if ($scope.places[i].name == name)
        return $scope.places[i]
    }
  };
  
  $scope.generateNN = function(){
    $scope.generateDistances();
    if ($scope.places.length > 2)
    {
      $scope.nnsequence = []
      var z = $scope.furthestPoint()
      
      var done = false
      while (!done)
      {
        if (z != null)
        {
          $scope.nnsequence.push($scope.findByName(z));
        }
        
        
        if ($scope.nnsequence.length == $scope.places.length || z == null)
        {
           done = true;
        } 
        else
        {
           z = $scope.nextPoint(z);
        }
      }
      
      console.log($scope.nnsequence);
      
    }
    else
    {
      console.log("There aren't enough places.")
    }
  };
  
}
IndexController.$inject = ["$scope"];
