﻿

//global variable with active position
var cordsWGS84 = { 'lat': 62.241642, 'lng': 25.759134 }; //google format when lat is first
var zoomlevel = 13;

//methods
window.load = function ()
{
  Loader.async = true;
  Loader.load(null, null, createMap);    
};

function showSMap()
{
    var cords = getCordsWGS84(true); //Different order lng and lat than Google!!!
    var center = SMap.Coords.fromWGS84(cords[0], cords[1]);

    var m = new SMap(JAK.gel("mapView"), center, zoomlevel);
    m.addDefaultLayer(SMap.DEF_BASE).enable();
    m.addDefaultControls();

    var layer = new SMap.Layer.Marker();
    m.addLayer(layer);
    layer.enable();

    var options = {};
    var marker = new SMap.Marker(center, "myMarker", options);
    layer.addMarker(marker);

    var sync = new SMap.Control.Sync({ bottomSpace: 30 });
    m.addControl(sync);
}

function showGMap()
{
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

function locationSearch() //find coords, set coords, reshow map
{    
    var address = document.getElementById('city').value; //grabing text field from GUI

<<<<<<< HEAD
    /*
=======
    //usage of google engine
    var geocoder = new google.maps.Geocoder();

>>>>>>> 060ae13d020f979a4323ae515aff905cd6a772ec
    geocoder.geocode({ 'address': address }, function (results, status)
    {
        if (status == google.maps.GeocoderStatus.OK)
        {
            var Lat = results[0].geometry.location.lat(); //gathering geo
            var Lng = results[0].geometry.location.lng();            
            setCordsWGS84(Lat, Lng); //saves geo for this document
        }
        else
        {
            alert("Something got wrong: " + status + ", map is not changed!"); //TODO better!
        }

        //usage of some other engine - unimplemented yet

        try //apply result
        {
            mapSelector(document.getElementById("selectMapSource").value); //prefere already selected map source
        }
        catch(exception)
        {
            mapSelector(); //use default way in function mapSelector
        }        
    });
}

function getWeatherData()
{

    //$("#weatherData").append("ewrwr");
    var apiKey = "6239cee266b1f3dab20248a67da1f994";

    var city_name;
    var temp;
    var pressure;
    var wind_speed;
    var country_name;
    var weather_description;

    $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid="+apiKey,function(data){
        city_name = data["name"];
        country_name = data["sys"]["country"];
        weather_description = data["weather"][0]["description"];
        temp = data["main"]["temp"];
        pressure = data["main"]["pressure"];
        wind_speed = data["wind"]["speed"];

        $("#weatherData").append(weather_description);
    });

    
    // $.ajax({       
    //     type: 'GET',
    //     dataType: 'json',
    //     data: {},
    //     url: "http://samples.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=b1b15e88fa797225412429c1c50c122a1&callback=test",
    //     error: function (jqXHR, textStatus, errorThrown) {
    //         console.log(jqXHR)
    //         alert("error to load data");
    //     },
    //     success: function (data, textStatus, jqXHR) {
    //         alert("success");       
    //     }
    // });

}

function mapSelector(mapNameFromSelector) //for showing map by selecting
{
    switch (mapNameFromSelector)
    {
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


