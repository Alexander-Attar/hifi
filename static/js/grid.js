$(function(){

    var $container = $('#content');

    var gutter = 5;
    var min_width = 300;

    $container.imagesLoaded( function(){
        $container.masonry({
            itemSelector : '.box',
            gutterWidth: gutter,
            isAnimated: false,
              columnWidth: function( containerWidth ) {
                var num_of_boxes = (containerWidth/min_width | 0);

                var box_width = (((containerWidth - (num_of_boxes-1)*gutter)/num_of_boxes) | 0) ;

                if (containerWidth < min_width) {
                    box_width = containerWidth;
                }

                $('.box').width(box_width);

                return box_width;
              }
        });
    });

    $container.infinitescroll({
        navSelector  : '.pagination',    // selector for the paged navigation
        nextSelector : '.next',          // selector for the NEXT link (to page 2)
        itemSelector : '#content .box',   // selector for all items you'll retrieve
        bufferPx: 10000,
        extraScrollPx: 12000,
        loading: {
            finishedMsg: '',
            img: 'http://www.acecrane.com/img/loading.gif'
        }
    },  // trigger Masonry as a callback
        function( newElements ) {
            // hide new items while they are loading
            var $newElems = $( newElements ).css({ opacity: 0 });
            // ensure that images load before adding to masonry layout
            $newElems.imagesLoaded(function() {
                // show elems now they're ready
                $newElems.animate({ opacity: 1 });
                $container.masonry( 'appended', $newElems ).masonry( 'reload' );
            });
        }
    );
});

// TODO - Rename this file from grid.js to something that makes more sense
$(function(){

    var $container = $('.block');

    $container.infinitescroll({
        navSelector  : '.pagination',    // selector for the paged navigation
        nextSelector : '.next',          // selector for the NEXT link (to page 2)
        itemSelector : '.block .brick',   // selector for all items you'll retrieve
        bufferPx: 10000,
        extraScrollPx: 12000,
        loading: {
            finishedMsg: '',
            img: 'http://www.acecrane.com/img/loading.gif'
        }
    },  // trigger Masonry as a callback
        function( newElements ) {
            // hide new items while they are loading
            var $newElems = $( newElements ).css({ opacity: 0 });
            // ensure that images load before adding to masonry layout
            $newElems.imagesLoaded(function() {
                // show elems now they're ready
                $newElems.animate({ opacity: 1 });
                $container.masonry( 'appended', $newElems ).masonry( 'reload' );
            });
        }
    );
});