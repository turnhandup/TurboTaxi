/**
 * Created by Nick on 14.06.2016.
 */
function init() {
    // Create a map object and specify the DOM element for display.
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 50.4, lng: 30.5},
        scrollwheel: false,
        zoom: 10
    });

    var inputTo = document.getElementById('to');
    var autocompleteTo = new google.maps.places.Autocomplete(inputTo);
    autocompleteTo.bindTo('bounds', map);

    var markerTo = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });

    autocompleteTo.addListener('place_changed', function () {
        markerTo.setVisible(false);
        var place = autocompleteTo.getPlace();
        if (!place.geometry) {
            return;
        }

        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(10);
        }
        markerTo.setIcon(/** @type {google.maps.Icon} */({
            url:"res/end.png",
            
        }));
        markerTo.setPosition(place.geometry.location);
        markerTo.setVisible(true);
        alert(markerFrom.getPosition()+" "+markerTo.getPosition());
        displayRoute(markerFrom.getPosition(), markerTo.getPosition());
    });

    var inputFrom = document.getElementById('from');
    var autocompleteFrom = new google.maps.places.Autocomplete(inputFrom);
    autocompleteFrom.bindTo('bounds', map);

    var markerFrom = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });

    autocompleteFrom.addListener('place_changed', function () {
        markerFrom.setVisible(false);
        var place = autocompleteFrom.getPlace();
        if (!place.geometry) {
            return;
        }

        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(10);
        }
        markerFrom.setIcon(/** @type {google.maps.Icon} */({
            url: "res/start.png"
        }));
        markerFrom.setPosition(place.geometry.location);
        markerFrom.setVisible(true);
        displayRoute(markerFrom.getPosition(), markerTo.getPosition());
    });

    function calculateRoute(A_latlng, B_latlng, callback) {
        var directionService = new google.maps.DirectionsService();
        directionService.route({
            origin: A_latlng,
            destination: B_latlng,
            travelMode: google.maps.TravelMode["DRIVING"]
        }, function (response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                callback(null, response);
            } else {
                callback(new Error("Can't find direction"));
            }
        });
    }

    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    directionsDisplay.setMap(map);
    
    function displayRoute(from, to) {
        calculateRoute(from, to, function (err, response) {
            if (!err) {

                var request = {
                    origin: from,
                    destination: to,
                    travelMode: google.maps.DirectionsTravelMode.DRIVING
                };

                
                var leg = response.routes[0].legs[0];
                document.getElementById("distance").textContent=parseFloat(leg.distance.text);
                document.getElementById("time").textContent=parseInt(leg.duration.value/60);
                document.getElementById("money").textContent=calcPrice(parseFloat(leg.distance.text));
            } else {
                console.log("Cannot calculate route");
            }
        });
        directionsService.route({
            origin: from,
            destination: to,
            travelMode: google.maps.TravelMode.DRIVING
        }, function(response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsDisplay.setOptions( { suppressMarkers: true } );
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }
    
    
}

function calcPrice(km) {
    if(km<=5){
        return 50;
    }
    else{
        var price = (km-5)*3.5 + 50;
        return price;
        
    }
}
//Коли сторінка завантажилась
google.maps.event.addDomListener(window, 'load', init);