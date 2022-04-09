console.log("Step 1 working");

var basemap = L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  }
);

// We create the map object with options.
var map = L.map("map", {
  center: [
    40.7, -94.5
  ],
  zoom: 3
});

basemap.addTo(map);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson").then(function(data) {


  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

//   Determine color of circles
    function getColor(depth) {
        switch (true) {
        case depth > 90:
          return "red";
        case depth > 50:
          return "orange";
        case depth > 30:
          return "yellow";
        case depth > 10:
          return "green";
        default:
          return "blue";
        }
      }
    
// Change size
      function getRadius(mag) {
        if (mag === 0) {
          return 1;
        }
    
        return mag * 4;
      }
    
      L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng); },

        style: styleInfo,
        onEachFeature: function(feature, layer) {
          layer.bindPopup(
            "Magnitude: "
              + feature.properties.mag
              + "<br>Depth: "
              + feature.geometry.coordinates[2]
              + "<br>Location: "
              + feature.properties.place
          );
        }
      }).addTo(map);



      var legend = L.control({
        position: "topright"
      });
    
      legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
    
        var grades = [10, 30, 50, 70, 90];
        var colors = ["blue","green","yellow","orange","red"];
    
        for (var i = 0; i < grades.length; i++) {
          div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
          + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
        return div;
      };
    
      // Add legend to the map.
      legend.addTo(map);
    });
    