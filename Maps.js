﻿//global variables, do not change, use setters and getters
var cordsWGS84 = { 'lat': 62.241642, 'lng': 25.759134 }; //google format when lat is first
var zoomlevel = 13;
var contentString = "";

//regular code start:
function refreshView(refreshAlsoWeather) //method for refreshing visual data after some change
{   
    if (refreshAlsoWeather)
    {
        var cords = getCordsWGS84(false);    
        getWeatherData(cords[0], cords[1]);
    }

    try //apply result to map
    {
        mapSelector(document.getElementById("selectMapSource").value); //prefere already selected map source
    }
    catch (exception) {
        mapSelector(); //use default way in function mapSelector
    }
}

function setMarkerOptions(city, temperature, weather_description, wind_speed) //string formating function
{
    this.contentString = 
    '<div>' +
    '<h1>' + city + '</h1>' +
    '<p><strong>Actual weather: </strong>' + weather_description +
    '<p><b>Temperature: </b>'+temperature+' °C</p>'+
    '<p><b>Wind speed: </b>'+wind_speed+' m/s</p>'+
    '</div>';
}

function flushMarkerOptions() {    
    this.contentString = "";
}

function getMarkerOptions(){
    return this.contentString;
}

window.load = function () //methods for Smap API
{
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

    var meteodata = getMarkerOptions(); //geting meteodata
    if (meteodata.length === 0) //do not make smart marker in case of no weather data
    {
        var options = {};
        var marker = new SMap.Marker(center, "myMarker", options);
    }
    else //make a smartcard instead of regular marker
    {
        var c = new SMap.Card();
        c.getBody().innerHTML = meteodata;
        var marker = new SMap.Marker(m.getCenter());        
        marker.decorate(SMap.Marker.Feature.Card, c);               

        //missing auto onclick to ready marker


        /* GOOGLE WAY
        var infowindow = new google.maps.InfoWindow({ content: meteodata });
        marker.addListener('click', function () { infowindow.open(map, marker); });
        */
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

    var meteodata = getMarkerOptions();
    var marker = new google.maps.Marker({ position: center, map: map });
    /*
    if (!meteodata.length === 0) //?working?
    {
        //title unused
        var infowindow = new google.maps.InfoWindow({ content: meteodata });        
        marker.addListener('click', function () {infowindow.open(map, marker); });
    }
    */
    var infowindow = new google.maps.InfoWindow({ content: meteodata });
    marker.addListener('click', function () { infowindow.open(map, marker); });      
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

        //usage of some other searching engine - unimplemented yet

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

    $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lng+"&appid="+apiKey+"&units=metric",function(data){

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
        default:
            //alert("Default option");
            showSMap();
            break;
    }
}
