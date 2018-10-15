// Construct the Map object
const map = L.map('mapid').setView([46, 25], 7);

// Construct the basemap object
const CartoDB_Voyager = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

// Counter for paths name
let count = 1;



// FeatureGroup is to store paths layers
const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems); // method to add the FeatureGroup to the map


_loadExistingPath(map, drawnItems)

// Function that loads dummy data
function _loadExistingPath(_map, pathLayer) {
    // Dummy path geometry
    const dummyPath = [
        [23.50, 46.50],
        [24.50, 46.50],
        [24.50, 46.10],
        [23.50, 46.10],
        [23.50, 45.50],
        [24.50, 45.50],
        [24.50, 45.00],
        [23.50, 45.00],
        [24.20, 44.75],
        [25.50, 44.75]
    ];
    const pointList = [];

    dummyPath.map(function(_point){
        const point = new L.LatLng(_point[1], _point[0]);
        pointList.push(point);
    });

    const dummyPolyline = new L.Polyline(pointList,{
        color: '#f06eaa',
        weight: 3.5
    });
    pathLayer.addLayer(dummyPolyline);

    addLayerInList(count, pathLayer, L.stamp(dummyPolyline));
}

// Event that triggers each time the button is clicked
document.getElementById('drawButton').addEventListener('click', function(){

    // Increase the counter to set the proper name of the path
    count += 1;
    
    // Create the drawer object 
    const pathDrawer = new L.Draw.Polyline(map);
    pathDrawer.enable();       
});

// Map event that triggers after the user finished drawing
map.on('draw:created', function (e) {

    // Save the draw in a layer
    const layer = e.layer;
    layer.setStyle({ opacity: 1 });

    // Add the layer to the FeatureGroup
    // FeatureGroup is already on the map
    // The layer will appear on the map
    drawnItems.addLayer(layer);

    addLayerInList(count, drawnItems, L.stamp(layer));
}); 

// Function that creates a row in the LayerList table for each layer added to map
// to simulate a layer list widget
function addLayerInList(counter, layerGroup, id){
    
    const tableBody = document.getElementById('layerListBody');

    // For each checkbox created, the corespondent layer`s id is added in id property
    const checkBox = 
        `<tr class="border"><td scope="row">` + 
        `<div class="form-group form-check">` + 
        `<input type="checkbox" class="form-check-input" id="${id}" checked="true">` + 
        `<label class="form-check-label">Path ${counter}</label>` + 
        `</div></td></tr>`;
    tableBody.innerHTML += checkBox;

    turnLayerOnOff(layerGroup);
};

// Function that iterates each checkbox from the LayerList table
// and adds a click event to it
// If the checkbox is checked, the coresponding layer is turned off, and viceversa
function turnLayerOnOff(layerGroup){
    Array.from(document.getElementsByClassName('form-check-input'))
        .map(function(checkbox){
            checkbox.addEventListener('click', function(){
                const layers = layerGroup.getLayers();
                layers.map(function(layer){
                    if (layer._leaflet_id === parseInt(checkbox.id)) {
                        if (checkbox.checked === false) {
                            layer.setStyle({ opacity: 0 });
                        } else {
                            layer.setStyle({ opacity: 1 });
                        }
                    }
                });
            });
        });
};



