(function( ol ){

    //Declare our module

    angular
        .module('PointBlue.OpenLayersMap', []);

    //Define directive for our module

    angular
        .module('PointBlue.OpenLayersMap')
        .directive('pbOpenLayersMap', pbOpenLayersMap);

    pbOpenLayersMap.$inject = ['pbOpenLayersMapFactory'];

    function pbOpenLayersMap(pbOpenLayersMapFactory){

        var map;

        return {
            restrict:'A',
            'link': link
        };

        function link( scope, element, attrs, controller, transcludeFn ){
            if( ! attrs.hasOwnProperty('id')){
                throw 'pbOpenLayersMap MUST have an id attribute set';
            }
            var options = attrs.hasOwnProperty('pbOpenLayersMap') ? scope.$eval( attrs['pbOpenLayersMap'] ) : {};
            map = pbOpenLayersMapFactory.createMap( options );
            map.setTarget( attrs['id'] );

            if( attrs.hasOwnProperty('visibleLayer') ){
                scope.$watch( attrs['visibleLayer'], handleVisibleLayerChanged );
            }


        }

        function handleVisibleLayerChanged( oldValue, newValue ){
            setLayerVisibility( oldValue, false );
            setLayerVisibility( newValue, true );
        }

        function setLayerVisibility( layerIndex, isVisible ){
            map.getLayers().item( layerIndex ).setVisible( isVisible );
        }

    }

    /**
     * pbOpenLayersMapFactory
     *
     * Create OpenLayers map for use with angular directive. Depends on the OpenLayers library being created first
     */

    angular
        .module('PointBlue.OpenLayersMap')
        .factory('pbOpenLayersMapFactory', pbOpenLayersMapFactory);

    function pbOpenLayersMapFactory(){

        var sourceConstructorMapping = {
            OSM: ol.source.OSM,
            XYZ: ol.source.XYZ
        };

        return {
            createMap : createMap
        };

        function createMap(options){

            var normalizedOptions = {};
            normalizedOptions.layers = [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
            ];

            normalizedOptions.view = createViewFromOptions(options);
            normalizedOptions.layers = options.layers ? createLayersFromOptions(options.layers) : [];

            return new ol.Map(normalizedOptions);
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