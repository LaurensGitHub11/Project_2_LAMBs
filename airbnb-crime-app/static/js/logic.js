
///////////////////////////
// javascript for network visualization
///////////////////////////

// create an array with nodes
var nodes = new vis.DataSet([
    // inner circle node
    {
        id: 100,
        label: 'Denver \n neighborhoods',
        color: '#33cccc',
        shape: 'circle',
        font: { arial: 8, bold: true, color: 'white' }
    },
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
            color: '#ff9933',
            shape: 'dot',
            title: `Total Crime in this Neighborhood:${value.total_crime},
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
// end of code 
///////////////////////////

///////////////////////////
// javascript for leaflet //
///////////////////////////

// Store our API endpoint inside queryUrl
var queryUrl = "/api/leaflet/geojson";
var API_KEY = "pk.eyJ1IjoibGhpbGluc2tpIiwiYSI6ImNqeDNtdmxiczAwcXAzeXJ1ZG5xOGN1b2UifQ.uij4FrWeAslHU7mk7UJnfw";

// perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
d3.json(queryUrl, createMarkers);

function createMarkers(response) {

    // pull the "features" property off of the response
    var features = response.features;

    // initialize an array to hold markers
    var markers = [];

    // loop through the features array
    for (var index = 0; index < features.length; index++) {
        var coordinate = features[index].geometry.coordinates

        // for each station, create a marker and bind a popup with the station's name
        var marker = new L.CircleMarker([coordinate[0], coordinate[1]], {
            color: "purple",
            radius: 4,
            weight: 0,
            opacity: 0.5
        })

        // add the marker to the markers array
        markers.push(marker);
    }
    // create a layer group made from the markers array, pass it into the createMap function
    createMap(L.layerGroup(markers));


}


function createMap(markers) {

    // create the tile layer that will be the background of our map

    var streetmap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: API_KEY
    });

    var satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.satellite',
        accessToken: API_KEY
    });

    // define a baselayer object to hold our base layer objects
    var baseMaps = {
        "Street Map": streetmap,
        "Satellite": satellite
    };


    // create an overlayMaps object to hold the bikeStations layer
    var overlayMaps = {
        "AirBNB": markers
    };

    // Create the map object with options
    var geoMap = L.map("map", {
        center: [39.7392, -104.9903],
        zoom: 13,
        preferCanvas: true,
        layers: [streetmap, markers]
    });

    // create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(geoMap);
}

 ///////////////////////////////
// javascript for plotly-lie //
///////////////////////////////

// populate neighborhood names
function getNeighborhoodName() {

    // Grab a reference to the dropdown select element
    var selector = document.getElementById("selDataset");

    // Use the list of sample names to populate the select options
    d3.json("/api/neighborhoodnames", function (error, neighborhoodNames) {

        neighborhoodNames.sort();

        for (var i = 0; i < neighborhoodNames.length; i++) {
            var currentOption = document.createElement('option')
            currentOption.text = neighborhoodNames[i]
            currentOption.value = neighborhoodNames[i]
            selector.appendChild(currentOption);
        }
    })
};

var base_url = "/api/pie"
getData(base_url + "City Park");

function getData(url) {
    d3.json(url, function (data) {
        buildPiePlot(data);
    })
}

function optionChanged(neighborhood) {
    var url = base_url + neighborhood;
    getData(url);
};

// function buildPlot(data) {
//     var yearArray = [];
//     var countArray = [];
//     var parseYear = d3.timeParse("%Y");

//     // fill each of the arrays with data
//     for (var i = 0; i < data.length; i++) {
//         yearArray.push(parseYear(data[i].year));
//         countArray.push(data[i].count);
//     }

//     // Create a trace object with the new arrays created
//     var trace1 =
//         {
//             x: yearArray,
//             y: countArray,
//             type: 'scatter'
//         };


//     var layout = {
//         title: "Trends in Landslide Occurances",
//         xaxis: {
//             title: "Year"
//         },
//         yaxis: {
//             title: "Number of Landslide Occurances"
//         }

//     };


//     // create a data array with the traces
//     var data = [trace1]

//     Plotly.newPlot('timePlot', data, layout);

// }
function init() {
    getNeighborhoodName();
};



// Initialize the dashboard
init();





///////////////////////////////
// javascript for plotly-pie //
///////////////////////////////

var pieBaseURL = "/api/pie/"
getPieData(pieBaseURL + "City Park");

function getPieData(pieURL) {
    d3.json(pieURL, function (pieData) {
        buildPiePlot(pieData);
    })
}
function optionChanged(neighborhood) {
    var url = base_url + neighborhood;
    var newPieURL = pieBaseURL + neighborhood;
    getData(url);
    getPieData(newPieURL);
};

function buildPiePlot(pieData) {

    // Build pie chart
    var pieValues = [];
    var pieLabels = [];

    // Fill each of the arrays with data
    for (var i = 0; i < pieData.length; i++) {
        pieValues.push(pieData[i].count);
        pieLabels.push(pieData[i].property_type);
    }
    // Build Pie Chart
    var data = [{
        values: pieValues,
        labels: pieLabels,
        type: 'pie'
    }];

    var layout = {
        title: "Listing Breakdown by Room Type"
    }

    var PIE = document.getElementById('pie');
    Plotly.newPlot(PIE, data, layout);
};








