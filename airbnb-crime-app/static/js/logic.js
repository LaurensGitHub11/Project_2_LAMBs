///////////////////////////
// javascript for map(laurens_super_logic)
///////////////////////////
const API_KEY = "pk.eyJ1IjoibGhpbGluc2tpIiwiYSI6ImNqeDNtdmxiczAwcXAzeXJ1ZG5xOGN1b2UifQ.uij4FrWeAslHU7mk7UJnfw";

// Create an initial map object
// Set the longitude, latitude, and the starting zoom level
var myMap = L.map("map").setView([39.7392, -104.9903], 13);

// Add a tile layer (the background map image) to our map
// Use the addTo method to add objects to our map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

d3.json("../../Resources/neighbourhoods.geojson", function(data) {
  // Creating a GeoJSON layer with the retrieved data
  var shapes = L.geoJson(data).addTo(myMap);

  L.control.layers({}, {'Neighborhoods': shapes}).addTo(myMap);

});


// Load data from listings.csv
d3.csv("../../Resources/listings.csv", function(error, lData) {
    if (error) return console.warn(error);

    // save each column into an array variable
    var lats = lData.map(data => data.latitude);
    // console.log("latitudes", lats);
    var longs = lData.map(data => data.longitude);
    var neighborhood = lData.map(data => data.neighbourhood);
    var property_type = lData.map(data => data.property_type);
    var room_type = lData.map(data => data.room_type);
    var price = lData.map(data => data.price);
    var num_reviews = lData.map(data => data.number_of_reviews);
    var review_score = lData.map(data => data.review_scores_rating);

    // zip each column list with the list of coords for alignment
    var coords = lats.map(function(e, i, a) {return [e, longs[i]]});
    var tools = coords.map(function(e, i, a) {return [coords, neighborhood[i]]});
    var tools2 = coords.map(function(e, i, a) {return [coords, property_type[i]]});
    var tools3 = coords.map(function(e, i, a) {return [coords, room_type[i]]});
    var tools4 = coords.map(function(e, i, a) {return [coords, price[i]]});
    var tools5 = coords.map(function(e, i, a) {return [coords, num_reviews[i]]});
    var tools6 = coords.map(function(e, i, a) {return [coords, review_score[i]]});

    console.log("coords", coords);
    // console.log("tools", tools);

//  lData.forEach(function(data) {
//      console.log("Latitude:", data.latitude);
//   });

// Create a new marker
// L.marker(coords).addTo(myMap);

// Loop through the coords array and create one marker for each airbnb coordinate object
for (var i = 0; i < coords.length; i++) {
    L.circleMarker(coords[i], {
      stroke: false,
      fillOpacity: 0.75,
      fillColor: "purple",
      radius: 4,
    }).bindPopup(`<h3>${tools2[i][1]}: ${tools3[i][1]}</h3><p style="line-height:2px">Neighborhood: ${tools[i][1]}</p><p style="line-height:2px">Price: ${tools4[i][1]}</p><p style="line-height:2px">Rating: ${tools6[i][1]}</p><p style="line-height:2px">Number of Reviews: ${tools5[i][1]}</p>`).addTo(myMap);
  }

});

// Load data from crime_2019.csv
d3.csv("../../Resources/crime_2019.csv", function(error, cData) {
  if (error) return console.warn(error);

  // save each column into an array variable
  var lats = cData.map(data => data.GEO_LAT);
  // console.log("latitudes", lats);
  var longs = cData.map(data => data.GEO_LON);
  var offense = cData.map(data => data.OFFENSE_CATEGORY_ID);
  var neigh = cData.map(data => data.NEIGHBORHOOD_ID);

  // zip the lists of lats, londs, and features
  var coords = lats.map(function(e, i, a) {return [e, longs[i]]});
  var tools = coords.map(function(e, i, a) {return [coords, offense[i]]});
  var tools2 = coords.map(function(e, i, a) {return [coords, neigh[i]]});

  console.log("SECONDcoords", coords);

  // create marker cluster group
  var markers = L.markerClusterGroup();

  for (var i = 0; i < coords.length; i++) {
    markers.addLayer(L.marker(coords[i]).bindPopup(`<p style="line-height:2px">Neighborhood: ${tools2[i][1]}</p><p style="line-height:2px">Crime Category: ${tools[i][1]}</p>`));
  };
  markers.addTo(myMap);

  L.control.layers({}, {'Crime Clusters': markers}).addTo(myMap);

});

  // // Loop through the coords array and create one marker for each crime coordinate object
  // for (var i = 0; i < coords.length; i++) {
  //     L.circleMarker(coords[i], {
  //     stroke: false,
  //     fillOpacity: 0.75,
  //     fillColor: "green",
  //     radius: 4,
  //     }).addTo(myMap);
  // }

// });

///////////////////////////
//end of map code (laurens_super_logic)
///////////////////////////


///////////////////////////
// javascript for network visualization (Mona Arami)
///////////////////////////

// create an array with nodes
var nodes = new vis.DataSet([
    // inner circle node
    { id: 100, 
      label: 'Denver \n neighborhoods', 
      color: '#33cccc', 
      shape: 'circle', 
      font: { arial : 8, bold: true, color: 'white'} },
]);

var edges = new vis.DataSet([
    // edges for 
    { from: 100, to: 1 },
    
]);

var vis_link = "/api/network_viz"


d3.json(vis_link, function (error, data) {
    if (error) throw error;

    data.forEach(function (value, index) {
        nodes.add({
            id: (index + 1), 
            size: (Math.sqrt((30 + value.total_crime))), 
            label: value.neighborhood, 
            color:'#ff9933',
            shape: 'dot', 
            title: `Total Crime in this Neighborhood:${value.total_crime}\
            AirBNB Average Price in this Neighborhood:$${value.average_price}`                    
        })
    })
})

// below code used to properly connect cneighborhood nodes to denver node
d3.json(vis_link, function (error, data) {
    if (error) throw error;

    data.forEach(function (value, index) {
            edges.add({
                from: 100, to: (index + 2)
            })
    })
});


// create a network
var container = document.getElementById('mynetwork');

// provide the data in the vis format
var data = {
    nodes: nodes,
    edges: edges
};
var options = {};

// initialize your network!
var network = new vis.Network(container, data, options);
///////////////////////////
// end of code (Mona Arami)
///////////////////////////