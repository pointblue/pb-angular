(function( ol ){

    /**
     * OpenLayersMapOptionsFactory
     *
     * Create options that can be used to instantiate an openlayers map.
     * The hope for this module is to allow controllers to define simple openlayers parameters
     *
     */

    angular
        .module('PointBlue.OpenLayersMap')
        .factory('OpenLayersMapOptionsFactory', OpenLayersMapOptionsFactory);

    function OpenLayersMapOptionsFactory(){

        var sourceConstructorMapping = {
            OSM: ol.source.OSM,
            XYZ: ol.source.XYZ
        };

        return {
            createMapOptions : createMapOptions
        };

        function createMapOptions( basicOptions ){

            var options = {};

            options.view = createViewFromOptions(basicOptions);
            options.layers = basicOptions.layers ? createLayersFromOptions(basicOptions.layers) : [];

            return options;
        }

        function createLayersFromOptions(layerOptions){
            var layers = [];
            for(var i = 0;i<layerOptions.length;i++){
                layers.push(createLayerFromOptions(layerOptions[i]));
            }
            return layers;
        }

        function createLayerFromOptions(options){
            var layer;
            if(options.hasOwnProperty('tile')){
                layer = createTileFromOptions(options.tile);
            }
            return layer;
        }

        function createTileFromOptions(options){
            var tileOptions = {};
            if(options.hasOwnProperty('source')){
                tileOptions.source = createSourceFromOptions(options.source);
            }
            if(options.hasOwnProperty('visible')) {
                tileOptions.visible = options.visible;
            }
            return new ol.layer.Tile(tileOptions);
        }

        function createSourceFromOptions(options){
            var sourceConstructor = sourceConstructorMapping[options.type];
            var constructorOptions = {};
            if(options.hasOwnProperty('url')){
                constructorOptions.url = options.url;
            }
            return new sourceConstructor(constructorOptions);
        }

        function createViewFromOptions(options){
            options = options || {};
            var normalizedViewOptions = options.hasOwnProperty('view') ? normalizeViewOptions(options) : {};
            return new ol.View(normalizedViewOptions);
        }

        function normalizeViewOptions(options){
            var normalizedViewOptions = {};
            if(options.view.hasOwnProperty('center')){
                normalizedViewOptions.center = ol.proj.fromLonLat(options.view.center);
            }
            if(options.view.hasOwnProperty('zoom')){
                normalizedViewOptions.zoom = options.view.zoom;
            }
            if(options.view.hasOwnProperty('minZoom')){
                normalizedViewOptions.minZoom = options.view.minZoom;
            }
            if(options.view.hasOwnProperty('maxZoom')){
                normalizedViewOptions.maxZoom = options.view.maxZoom;
            }
            return normalizedViewOptions;
        }
    }

})( ol );