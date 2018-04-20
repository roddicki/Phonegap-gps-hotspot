
document.addEventListener('deviceready', function() {
    /* Javascript for device api here... */
    console.log('\n-------------\nDEVICE READY');
    getMapLocation();
   
});

//hotspot 1
var corner1Lat = 51.497721;
var corner1Lon = -2.548406;
var corner2Lat = 51.497654;
var corner2Lon = -2.547979;   


var Latitude = undefined;
var Longitude = undefined;

// Get geo coordinates

function getMapLocation() {

    navigator.geolocation.getCurrentPosition
    (onLocationSuccess, onLocationError, { enableHighAccuracy: true });
}

// Success callback for get geo coordinates

var onLocationSuccess = function (position) {
    Latitude = position.coords.latitude;
    Longitude = position.coords.longitude;
    initMap();
}

function onLocationError(error) {
    console.log('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}



localStorage.clear();

//global google map and marker
var gMap, marker;
var inHotspot = false;

//Initialise map from maps.googleapis.com/maps/api callback
function initMap() {
  console.log("hello map initiated")
  navigator.geolocation.getCurrentPosition(function(pos) {
        drawMap(pos);
        drawMarker(pos);  
        drawHotSpot();
        watchLocation();
        //check position initally
      }, 
      showError, 
      { timeout: 15000, enableHighAccuracy: true });
  
}

//DRAW MAP INITIALLY
function drawMap(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    gMap = new google.maps.Map(document.getElementById('mapholder'), {
          center: {lat:lat, lng: lon},
          zoom: 19
        });
}

//DRAW MARKER INITIALLY
function drawMarker(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    var myLocation = {lat: lat, lng: lon};
    //assign global marker
    marker = new google.maps.Marker({
          position: myLocation,
          map: gMap
        });
}

//MONITOR LOCATION
function watchLocation() {
    navigator.geolocation.watchPosition(function(pos) {
      displayPositionCoords(pos);
      panMap(pos);
      var haveEnteredExited = checkPositionHotspot1(pos);
      //alert(haveEnteredExited);
      
      /*if (haveEnteredExited == "entering" && hotspot.onEnterLoadPage != false) {window.location.href = hotspot.onEnterLoadPage};
      if (haveEnteredExited == "exiting" && hotspot.onExitLoadPage != false) {window.location.href = hotspot.onExitLoadPage};
      //play audio on entering and exiting
      if (haveEnteredExited == "entering" && hotspot.onEnterPlayAudio != false) {
          //
        document.getElementById('msg').innerHTML += " play audio";
        //playAudio(hotspot.onEnterPlayAudio);
      };
      if (haveEnteredExited == "exiting" && hotspot.onExitPlayAudio != false) {playAudio(hotspot.onExitPlayAudio)};*/
    }, showError, { timeout: 25000, maximumAge: 0, enableHighAccuracy: true }); 
}

//CHECK POSITION EVERY TIME watchPosition executes
function checkPositionHotspot1(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    //alert(" running checkPosition latitude:" + lat + " Longitude:" + lon);
    
    if ( (lat > corner2Lat && lat < corner1Lat) && (lon < corner2Lon && lon > corner1Lon) ) {
      document.getElementById('msg').innerHTML = "In the hotspot + ";
      if (localStorage.getItem("hotspotState") != "haveEntered") {
        localStorage.setItem("hotspotState", "haveEntered");
        document.getElementById('msg').innerHTML += "entering"
        return "entering";
      } else {
        localStorage.setItem("hotspotState", "haveEntered");
        document.getElementById('msg').innerHTML += "inside"
        return "inside";
      };
    } else {
      document.getElementById('msg').innerHTML = "NOT in the hotspot + ";
      if (localStorage.getItem("hotspotState") == "haveEntered") {
        localStorage.setItem("hotspotState", "haveExited");
        document.getElementById('msg').innerHTML += "exiting"
        return "exiting";
      } else {
        localStorage.setItem("hotspotState", "haveExited");
        document.getElementById('msg').innerHTML += "outside"
        return "outside";
      };
    };
}



//DRAW HOTSPOT INITIALLY
function drawHotSpot() {
    var hotspotShape = new google.maps.Rectangle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: gMap,
      bounds: {
        north: corner1Lat,
        south: corner2Lat,
        east: corner2Lon,
        west: corner1Lon
      }
    });
}

//PAN MAP AND MARKER
function panMap(position){
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    var center = new google.maps.LatLng(lat, lon);
    // using global variable:
    gMap.panTo(center);
    marker.setPosition(center);
}


//ERROR
function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}



function displayPositionCoords(position) {
  var x = document.getElementById("demo");
  x.innerHTML = "Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude + "<br><br>";
}

