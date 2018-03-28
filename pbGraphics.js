(function( root ){

    Graphics.$inject = ['$rootScope'];

    function Graphics($rootScope){

        return {
            adjustByWidth:adjustByWidth,
            svgToDataUrl:svgToDataUrl
        };

        /**
         * Create an image data url from svg html
         *
         * SVG root element must have the `version` and `xmlns` attributes correctly set
         * @param svg HTMLElement | string And svg element or the complete html of the svg element
         * @param callback required function called with the image data url as the only argument
         * @param w integer width of the output image
         * @param h integer height of the output image
         * @param imageType string 'png' or 'jpeg' works well. defaults to 'jpeg'
         * @param backgroundColor null to ignore this option
         * @private
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
         * @param width Current width
         * @param height Current height
         * @param targetWidth Desired width
         * @returns {*[]} Array First item is the width, second item is the height
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

    GraphicsFactory.$inject = ['pb'];

    function GraphicsFactory(pb){
        //add to the root object if needed
        if( ! pb.Graphics ){
            pb.Graphics = Graphics();
        }
        return pb.Graphics;
    }

    if(root.angular){

        //
        //CREATE IN ANGULAR
        //

        var angular = root.angular;

        //new module
        angular.module('pb.Graphics', ['pb']);

        //provides the graphics factory
        angular
            .module('pb.Graphics')
            .factory('Graphics', GraphicsFactory)
        ;

        run.$inject = ['$injector'];
        angular
            .module('pb.Graphics')
            .run(run)
        ;

        function run($injector){
            //force the factory function to run. this adds the `Graphics` object to the `pb` object
            $injector.get('Graphics');
        }


    } else {
        root.pb = root.pb || {};
        root.pb.Graphics = Graphics();
    }



})( window );