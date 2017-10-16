//global variable
var cordsWGS84 = {
    'lat': 62.241642, 'lng': 25.759134,
}

//methods
window.load = function ()
{
  Loader.async = true;
  Loader.load(null, null, createMap);    
};

function showSMap()
{    
    var center = SMap.Coords.fromWGS84(25.7592386, 62.2416150); //Different order lng+lat than Google!   

    var m = new SMap(JAK.gel("mapView"), center, 13);
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
    //var uluru = { lat: -25.363, lng: 131.044 };    
    var center = { lat: 62.241642, lng: 25.759134 };

    var map = new google.maps.Map(document.getElementById('mapView'),
        {
            zoom: 13,
            center: center
        });
    var marker = new google.maps.Marker({ position: center, map: map });
}

function getCordsWGS84(bool lngFirst)
{

    var a = x + 1,
        b = y + 1;
    return [a, b];

    if (lngFirst)
    {
        return[]
    }
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

