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
            var options = attrs.hasOwnProperty('pbOpenLayersMap') ? scope.$eval(attrs['pbOpenLayersMap']) : {};
            map = pbOpenLayersMapFactory.createMap( options );
            map.setTarget( attrs['id'] );
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

            return new ol.Map(normalizedOptions);
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
            return normalizedViewOptions;
        }
    }

})( ol );