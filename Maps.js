﻿//global variables, do not change, use setters + getters
var cordsWGS84 = { 'lat': 62.241642, 'lng': 25.759134 }; //google format when lat is first
var zoomlevel = 13;
var markerHeader = "";
var contentString = '<div id="content">' +
    '<div id="siteNotice">' +
    '</div>' +
    '<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
    '<div id="bodyContent">' +
    '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
    'sandstone rock formation in the southern part of the ' +
    'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) ' +
    'south west of the nearest large town, Alice Springs; 450&#160;km ' +
    '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major ' +
    'features of the Uluru - Kata Tjuta National Park. Uluru is ' +
    'sacred to the Pitjantjatjara and Yankunytjatjara, the ' +
    'Aboriginal people of the area. It has many springs, waterholes, ' +
    'rock caves and ancient paintings. Uluru is listed as a World ' +
    'Heritage Site.</p>' +
    '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
    'https://en.wikipedia.org/w/index.php?title=Uluru</a> ' +
    '(last visited June 22, 2009).</p>' +
    '</div>' +
    '</div>';
var markerFooter = "";

//regular code start:
function setMarkerOptions(header, body, footer) {
    this.markerHeader = header;
    this.contentString = body;
    this.footer = footer;
}

function flushMarkerOptions() {
    this.markerHeader = "";
    this.contentString = "";
    this.footer = "";
}

function getMarkerOptions() {
    return [this.markerHeader, this.contentString, this.footer];
}

//methods
window.load = function () {
    Loader.async = true;
    Loader.load(null, null, createMap);
};

function showSMap() {
    var cords = getCordsWGS84(true); //Different order lng and lat than Google!!!
    var center = SMap.Coords.fromWGS84(cords[0], cords[1]);

    var m = new SMap(JAK.gel("mapView"), center, zoomlevel);
    m.addDefaultLayer(SMap.DEF_BASE).enable();
    m.addDefaultControls();

    var layer = new SMap.Layer.Marker();
    m.addLayer(layer);
    layer.enable();

    var meteodata = getMarkerOptions();
    if (meteodata == null)
    {
        var options = {};
        var marker = new SMap.Marker(center, "myMarker", options);
    }
    else
    {
        var c = new SMap.Card(); //smartcard
        c.getHeader().innerHTML = meteodata[0];
        c.getFooter().innerHTML = meteodata[1];
        c.getBody().innerHTML = meteodata[2];
        var marker = new SMap.Marker(m.getCenter());
        marker.decorate(SMap.Marker.Feature.Card, c);
    }
    layer.addMarker(marker);

    var sync = new SMap.Control.Sync({ bottomSpace: 30 });
    m.addControl(sync);
}

function showGMap() {
    var cords = getCordsWGS84(false);
    var center = { lat: cords[0], lng: cords[1] };

    var map = new google.maps.Map(document.getElementById('mapView'),
        {
            zoom: zoomlevel,
            center: center
        });

    var marker = new google.maps.Marker({ position: center, map: map });
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
        default:
            //alert("Default option");
            showSMap();
            break;
    }
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

        //usage of some other engine - unimplemented yet

        


        try //apply result to map
        {
            mapSelector(document.getElementById("selectMapSource").value); //prefere already selected map source
        }
        catch (exception) {
            mapSelector(); //use default way in function mapSelector
        }
    });
}

function getWeatherData(lat, lng)
{   
    //$("#weatherData").append("ewrwr");
    var apiKey = "6239cee266b1f3dab20248a67da1f994";

    var city_name;
    var temp;
    var pressure;
    var wind_speed;
    var country_name;
    var weather_description;

    $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lng+"&appid="+apiKey+"&units=metric",function(data){

        city_name = data["name"];
        country_name = data["sys"]["country"];
        weather_description = data["weather"][0]["description"];
        temp = data["main"]["temp"];
        pressure = data["main"]["pressure"];
        wind_speed = data["wind"]["speed"];

        $("#temperature").empty();
        $("#weatherDescription").empty();
        $("#windSpeed").empty();

        $("#temperature").append("Temperature: " + temp);
        $("#weatherDescription").append("Description: " + weather_description);
        $("#windSpeed").append("Wind speed:" + wind_speed);
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
        default:
            //alert("Default option");
            showSMap();
            break;
    }
}
