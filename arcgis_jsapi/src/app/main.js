require([
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/Sketch/SketchViewModel",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/widgets/LayerList",
    "esri/geometry/Point"
], function (Map, MapView, SketchViewModel, Graphic, GraphicsLayer, LayerList, Point) {

    // Identifier to add to path name
    let count = 1;
    
    // Map instance
    const map = new Map({
        basemap: "streets"
    });

    // Mapview instance that holds the map
    const view = new MapView({
        container: "mapView",
        map: map,
        zoom: 7,
        center: [25, 46] // longitude, latitude
    });

    // Point symbol
    const pointSymbol = {
        type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
        style: "square",
        color: "red",
        size: "16px",
        outline: { // autocasts as new SimpleLineSymbol()
            color: [255, 255, 255],
            width: 3
        }
    };

    // Polyline symbol
    const polylineSymbol = {
        type: "simple-line", // autocasts as new SimpleLineSymbol()
        color: "red",
        width: "4",
        style: "solid"
    };

    
    // Layer list widget which will hold the paths
    const layerList = new LayerList({
        view: view,
        container: "layerList"
    });

    _loadExistingPaths(map, polylineSymbol);

    // Event when clicking draw button
    document.getElementById('drawPath').addEventListener('click', function () {
        _addPaths(map, view, pointSymbol, polylineSymbol);
    });
    
    // Function that loads the dummy path
    function _loadExistingPaths(map, symbol) {
        
        // Dummy path geometry
        const dummyPath = {
            type: "polyline", // autocasts as new Polyline()
            paths: [
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
            ]
        };

        // Create new graphic object with the dummy geometry
        const data = new Graphic({
            geometry: dummyPath,
            symbol: symbol
        });

        // Create the graphics layer object which will hold the drawns
        // This layer will be added to the map 
        const graphicsLayer = new GraphicsLayer({
            id: "tempGraphics" + Math.random().toString(),
            title: `Path ${count}`
        });

        graphicsLayer.add(data);
        map.add(graphicsLayer);
    };

    // Function that triggers when clicking button to start draw
    function _addPaths(map, mapView, _pointSymbol, _polylineSymbol, _count) {
        // Increase by 1
        count += 1;

        // Create the graphics layer object which will hold the drawns
        // This layer will be added to the map 
        const graphicsLayer = new GraphicsLayer({
            id: "tempGraphics" + Math.random().toString(),
            title: `Path ${count}`
        });

        // Create the sketch widget which enables the functionality to draw on the map
        const sketchViewModel = new SketchViewModel({
            view: mapView,
            layer: graphicsLayer,
            pointSymbol: _pointSymbol,
            polylineSymbol: _polylineSymbol
        });

        // Specify the geometry type
        // Creates the requested draw action
        sketchViewModel.create("polyline");

        // Add the graphics layer in the layer list as a unique path
        map.add(graphicsLayer, -1);

        // Inner event on sketch widget that triggers when the draw is completed
        sketchViewModel.on("create-complete", addGraphic);

        // Create a new graphic and set its geometry to
        // `create-complete` event geometry.
        function addGraphic(event) {
            const lineGraphic = new Graphic({
                geometry: event.geometry,
                symbol: sketchViewModel.graphic.symbol
            });
            graphicsLayer.add(lineGraphic);
        };
    };
});