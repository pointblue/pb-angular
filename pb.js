/**
 * A root object to attach stuff to
 */
(function( root ){

    pbFactory.$inject = [];

    //save a reference to the root object so it can be augmented
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