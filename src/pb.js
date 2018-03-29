(function( root ){

    pbFactory.$inject = [];

    /**
     * Root namespace to attach all support libraries.
     *
     * Example: pb.Maps
     *
     * @class
     * @alias pb
     * @type {{}}
     */
    var PointBlue = {};

    //just return the root object
    function pbFactory(){
        return PointBlue;
    }

    if(root.angular){
        var angular = root.angular;
        angular.module('pb', []);
        angular.module('pb').factory('pb', pbFactory);
    } else {
        root.pb = pbFactory();
    }

})( window );