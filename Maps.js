//global variables, do not change, use setters and getters
var cordsWGS84 = { 'lat': 62.241642, 'lng': 25.759134 }; //google format when lat is first
var zoomlevel = 13;
var contentString = "";


$(document).ready(function () {
    $("#city").keyup(function (event) {
        if (event.keyCode === 13) {
            $("#findBtn").click();
        }
    });
});

//regular code start:
function refreshView(refreshAlsoWeather) //method for refreshing visual data after some change
{
    if (refreshAlsoWeather) {
        var cords = getCordsWGS84(false); //get coords in google format
        getWeatherData(cords[0], cords[1]); //get weather for this coords to global property
    }

    try //apply result to map
    {
        mapSelector(document.getElementById("selectMapSource").value); //prefere already selected map source
    }
    catch (exception) {
        mapSelector(); //use default way in function mapSelector
    }
}

function setMarkerOptions(city, temperature, weather_description, wind_speed) //string formating weather data
{
    this.contentString =
        '<div>' +
        '<h1>' + city + '</h1>' +
        '<p><strong>Actual weather: </strong>' + weather_description +
        '<p><b>Temperature: </b>' + temperature + ' °C</p>' +
        '<p><b>Wind speed: </b>' + wind_speed + ' m/s</p>' +
        '</div>';
}

function getMarkerOptions() {
    return this.contentString;
}

window.load = function () //methods for Smap API
{
    Loader.async = true;
    Loader.load(null, null, createMap);
};

function showSMap() //Seznam mapy api (mapy.cz or api.mapy.cz)
{
    var cords = getCordsWGS84(true); //different order lng and lat than Google!!!
    var center = SMap.Coords.fromWGS84(cords[0], cords[1]);

    var mapa = new SMap(JAK.gel("mapView"), center, zoomlevel);
    mapa.addDefaultLayer(SMap.DEF_BASE).enable();
    mapa.addDefaultControls();

    var layer = new SMap.Layer.Marker();
    mapa.addLayer(layer);
    layer.enable();

    var meteodata = getMarkerOptions(); //geting meteodata
    if (meteodata.length === 0) //do not make smart marker in case of no weather data
    {
        var options = {};
        var marker = new SMap.Marker(center, "cityMarker", options);
        layer.addMarker(marker);
    }
    else //make a smartcard instead of regular marker
    {
        var marker = new SMap.Marker(mapa.getCenter()); //random generated ID of marker      
        var options = { anchor: { top: -50, bottom: 1 } }; //moves card out of place pointer
        var card = new SMap.Card("cityMarker", options);

        card.getBody().innerHTML = meteodata; //placing text information to card
        marker.decorate(SMap.Marker.Feature.Card, card); //linking marker with card

        layer.addMarker(marker); //placing marker to map
        mapa.addCard(card, marker.getCoords()); //placing open card to map (autoclick)
    }

    //add https://api.mapy.cz/view?page=pointer

    var sync = new SMap.Control.Sync({ bottomSpace: 30 });
    mapa.addControl(sync);
}

function showGMap() //google maps https://developers.google.com/maps/documentation/javascript/
{
    var cords = getCordsWGS84(false);
    var center = { lat: cords[0], lng: cords[1] };

    var map = new google.maps.Map(document.getElementById('mapView'),
        {
            zoom: zoomlevel,
            center: center
        });

    var meteodata = getMarkerOptions();
    //meteodata = ""; //debug
    var marker = new google.maps.Marker({ position: center, map: map });

    if (meteodata.length != 0) //if not empty then you can show infowindow
    {
        var infowindow = new google.maps.InfoWindow;
        infowindow.setContent(meteodata);
        infowindow.open(map, marker);
        marker.addListener('click', function () { infowindow.open(map, marker); });
    }
}

function showBMap() 
{
    var cords = getCordsWGS84(false);
    var center = new Microsoft.Maps.Location(cords[0], cords[1]);
    var meteodata = getMarkerOptions();

    var map = new Microsoft.Maps.Map('#mapView', {
        credentials: 'Arvn8chsNiRnXdKwD0C4h_BjG_zFoP_lSJnbtBNN-I8pS6NKogwpqMViaWHvtw8r',
        center: center
    });    

    //Create an infobox that will render in the center of the map.
    var infobox = new Microsoft.Maps.Infobox(center, {        
        description: meteodata,
        center: center,
        maxHeight: 300        
    });

    //Assign the infobox to a map instance.
    infobox.setMap(map);
}

function showHMap() //Here maps https://developer.here.com/documentation/maps/
{
    var platform = new H.service.Platform({'app_id': '2eviPbL6VJg3XZop4ZS7', 'app_code': 'b2n2503pETUQ4l55pm0Slg', useCIT: true, useHTTPS: true }); // Initialize the platform object:    

    var defaultLayers = platform.createDefaultLayers(); // Obtain the default map types from the platform object:    

    var cords = getCordsWGS84(false);
    var center = { lat: cords[0], lng: cords[1] };

    // Instantiate (and display) a map object:
    var map = new H.Map(document.getElementById('mapView'), defaultLayers.terrain.map,
        {
            zoom: zoomlevel,
            center: center
        });   

    //Step 3: make the map interactive
    // MapEvents enables the event system
    // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

    // Create the default UI components
    var ui = H.ui.UI.createDefault(map, defaultLayers);

    // Create an info bubble object at a specific geographic location:
    var meteodata = getMarkerOptions();
    var bubble = new H.ui.InfoBubble({lng: '25.759134', lat: '62.241642' }, { content: meteodata });    
    ui.addBubble(bubble); // Add info bubble to the UI:
}

function getCordsWGS84(lngFirst) //central cords returner
{
    if (lngFirst) //lngFirstForSeznamMapyAPI
    {
        return [cordsWGS84.lng, cordsWGS84.lat];
    }
    return [cordsWGS84.lat, cordsWGS84.lng]; //standard format
}

function setCordsWGS84(lat, lng) //cords handling
{
    this.cordsWGS84.lat = lat;
    this.cordsWGS84.lng = lng;
}

function locationSearch() //find coords, set coords, reshow map
{
    var address = document.getElementById('city').value; //grabing text field from GUI

    //usage of google engine
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var Lat = results[0].geometry.location.lat(); //gathering geo
            var Lng = results[0].geometry.location.lng();
            setCordsWGS84(Lat, Lng); //saves geo for this document

            // get weather for coords
            getWeatherData(Lat, Lng);
        }
        else {
            alert("Something got wrong: " + status + ", map is not changed!"); //TODO better!
        }

        refreshView(false);
    });
}

function getWeatherData(lat, lng) //asking meteo service
{
    var apiKey = "6239cee266b1f3dab20248a67da1f994";
    var city_name;
    var temp;
    var pressure;
    var wind_speed;
    var country_name;
    var weather_description;

    $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lng + "&appid=" + apiKey + "&units=metric", function (data) {

        city_name = data["name"];
        weather_description = data["weather"][0]["description"];
        temp = data["main"]["temp"];
        pressure = data["main"]["pressure"];
        wind_speed = data["wind"]["speed"];

        setMarkerOptions(city_name, temp, weather_description, wind_speed); //set it to marker builder
        refreshView(false);
    });
}

function mapSelector(mapNameFromSelector) //for showing map by selecting
{
    switch (mapNameFromSelector) {
        case "Smap":
            //alert("Seznam");
            showSMap();
            break;
        case "Gmap":
            //alert("Google");
            showGMap();
            break;
        case "Hmap":
            //alert("Here");
            showHMap();
            break;
        case "Bmap":
            //alert("Bing");
            showBMap();
            break;
        default:
            //alert("Default option");
            showSMap();
            break;
    }
}