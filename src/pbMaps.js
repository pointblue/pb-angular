(function( root ){

    Maps.$inject = ['$rootScope'];

    /**
     * Maps library for Point Blue.
     * Contains map functions which are useful for multiple projects.
     * Used as `pb.Maps`
     *
     * @class
     * @alias pb.Maps
     * @param $rootScope
     * @returns {{adjustByWidth: adjustByWidth, svgToDataUrl: svgToDataUrl}}
     */
    function Maps($rootScope){

        return {
            adjustByWidth:adjustByWidth,
            svgToDataUrl:svgToDataUrl
        };

        /**
         * Create an image data url from svg html.
         * SVG root element must have the `version` and `xmlns` attributes correctly set.
         * Returns data url in supplied callback function
         *
         *
         * @async
         * @param {HTMLElement|string} svg And svg element or the complete html of the svg element
         * @param {function} callback required function called with the image data url as the only argument
         * @param {int} w integer width of the output image
         * @param {int} h integer height of the output image
         * @param {string} imageType string 'png' or 'jpeg' works well. defaults to 'jpeg'
         * @param {string} backgroundColor null to ignore this option
         */
        function svgToDataUrl( svg, callback, w, h, imageType, backgroundColor){
            var svgIsHtml = typeof svg === 'string';
            //html to data url
            var imgSrc = 'data:image/svg+xml;base64,'+ btoa(svgIsHtml ? svg : svg.outerHTML);
            var canvas = document.createElement('canvas');
            if(! svgIsHtml){
                //get width from the node if no width argument given
                if( !w && svg.getAttribute('width') ){
                    w = parseInt( svg.getAttribute('width') );
                }

                //geth height from the node if no width argument given
                if( !h && svg.getAttribute('height') )
                    h = parseInt( svg.getAttribute('height') );
            }
            if(w){
                canvas.width = w;
            }

            if(h){
                canvas.height = h;
            }

            var context = canvas.getContext('2d');
            if(backgroundColor){
                context.fillStyle = backgroundColor || 'white';
                context.fillRect(0,0,canvas.width,canvas.height);
            }
            var img = new Image();
            img.onload = function(){
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
                var jpeg = canvas.toDataURL('image/' + imageType || 'jpeg');
                //pass the image stream to the callback function
                //if using angular, apply the changes in angular's context using $apply
                if($rootScope){
                    $rootScope.$apply(function(){
                        callback( jpeg );
                    });
                } else {
                    callback( jpeg );
                }

            };
            img.src = imgSrc;
        }

        /**
         * Scales height at the same ratio as (width / targetWidth).
         * This effectively allows you to determine what the resulting scaled height is when going from one width
         * to another.
         *
         *
         * @param {int}width Current width
         * @param {int} height Current height
         * @param {int} targetWidth Desired width
         * @returns {Array} First element is the targetWidth, second is the resultant height
         */
        function adjustByWidth(width, height, targetWidth){
            //ratio of the width to the target width
            var ratioWidthToTarget = width / targetWidth;
            //width adjusted by ratio
            var adjustedWidth = width / ratioWidthToTarget;
            return [
                adjustedWidth,
                //height adjusted to match the ratio of adjusted width to map width
                (adjustedWidth * height) / width
            ];
        }

    }

    MapsFactory.$inject = ['pb'];

    function MapsFactory(pb){
        //add to the root object if needed
        if( ! pb.Maps ){
            pb.Maps = Maps();
        }
        return pb.Maps;
    }

    if(root.angular){

        //
        //CREATE IN ANGULAR
        //

        var angular = root.angular;

        //new module
        angular.module('pb.Maps', ['pb']);

        //provides the graphics factory

        run.$inject = ['$injector'];
        angular
            .module('pb.Maps')
            .factory('Graphics', MapsFactory)
            .run(run)
        ;

        function run($injector){
            //force the factory function to run. this adds the `Maps` object to the `pb` object
            $injector.get('Maps');
        }


    } else {
        root.pb = root.pb || {};
        root.pb.Maps = Maps();
    }



})( window );