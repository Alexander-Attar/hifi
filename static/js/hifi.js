var spinner;
var tags = [
    'gif', 'art', 'technology', 'music', 'sound', 'science', 'love', 'light', 'dark', 'electronic', 'cyber', 'nyc'
];

function createSpinnder() { // ridin' spinners
    var opts = {
        lines: 13, // The number of lines to draw
        length: 15, // The length of each line
        width: 2, // The line thickness
        radius: 7, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#000', // #rgb or #rrggbb or array of colors
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: 'auto', // Top position relative to parent in px
        left: 'auto' // Left position relative to parent in px
    };
    var target = document.getElementById('loading');
    var s = new Spinner(opts).spin(target);
    spinner = s;
}

$(document).ready(function() {
    SC.initialize({
      client_id: '51e5315d2d8046ad3b14ba65871265b2',
      redirect_uri: "http://hifi.herokuapp.com/"
    });
    $('#loading').hide();
});

$("#connect").live("click", function(){
    SC.connect(function(){
        SC.get("/me", function(me){

            $('#project-description').hide();
            $('#connect').hide();
            $('#instructions').removeClass('hide');
            $('#my-sounds').removeClass('hide');
            $('#genres').removeClass('hide');

            SC.get("/me", function(me){
                console.log(me);
            });
        });
    });
});

// TODO - Combine logic for click events for user and genre buttons
// Grab an uploaded track from a user's sounds or one of their favorite sounds
$('.me').click(function(e) {

    $('#instructions').hide();
    createSpinnder();
    $('#loading').show();
    $('#sound-load-error').hide();
    var selection = $(e.target).closest('.btn').text().toLowerCase();

    // get images from tumblr
    tumble(tags, selection);
});

// Grab a random track based on genre selected
$('.genre').click(function(e) {
    $('#instructions').hide();
    createSpinnder();
    $('#loading').show();
    $('#sound-load-error').hide();
    var selection = $(e.target).closest('.btn').text().toLowerCase();

    // get images from tumblr
    tumble(tags, selection);
});

function getTracks(selection) {

    var soundcloud_url = null;

    if (selection == 'my sounds') {
        soundcloud_url = '/me/tracks';
    }

    if (selection == 'my favorites'){
        soundcloud_url = '/me/favorites';
    }

    if (soundcloud_url) {
        SC.get(soundcloud_url, function(tracks) {
            // get a random track from the sounds returned
            var random = Math.floor(Math.random() * tracks.length);
            var soundcloud_url = tracks[random].permalink_url;
            setupWidget(soundcloud_url);
        });
    } else {
        // increase the amount of tracks returned from 50 to 200 and change offset randomly for more variance
        SC.get('/tracks', { genres: selection, limit: 200, offset: Math.floor(Math.random() * 7999) }, function(tracks) {

            // get a random track from the 200 returned
            var random = Math.floor(Math.random() * 199);
            var soundcloud_url = tracks[random].permalink_url;
            setupWidget(soundcloud_url);
        });
    }
}

function getImages(data, images) {

    for (var i = 0; i < data.response.length; i++) {

        // get the image url from the post
        if (data.response[i].photos){
            images.push(data.response[i].photos[0].original_size.url);
        }
    }
}

function tumble(tags, selection) {

    images = [];  // reset images
    $('#image-holder').empty();  // clear out images in the DOM

    for (var tag = 0; tag < tags.length; tag++) {

        var url = 'http://api.tumblr.com/v2/tagged?api_key=YP7Ou3HkhMg9eXEsHK3ZEXK041U8yhhnrzhZIrJd47y498Cd7c&tag=' + tags[tag];

        // dynamically name requests
        var name = 'req' + tag;
        window[name] = $.ajax({
            async: false,
            url: url,
            dataType: "jsonp",
            jsonp: 'jsonp'}).success(function(data){ getImages(data, images);
        });
    }

    // wait for all ajax requests to be done
    // TODO - make the number of requests to wait for dynamic
    $.when(req0, req1, req2, req3, req4, req5, req6, req7, req8, req9, req10, req11).done(function(){
        embedImages(images, selection);
    });
}

function shuffle(array) {
    var counter = array.length, temp, index;

    // While there are elements in the array
    while (counter--) {
        // Pick a random index
        index = (Math.random() * counter) | 0;

        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

function embedImages(images, selection) {

    // randomize the order of the images
    images = shuffle(images);

    for (var i = 0; i <= images.length; i++) {
        var imageId = 'image' + i;
        $('#image-holder').append('<div id="' + imageId + '" class="row text-center hide"><img src="'+ images[i] + '"></div>');
    }

    // once the images are loaded we can get the audio and set the image transition points
    getTracks(selection);
}

function setupWidget(soundcloud_url) {

    var transitions = [];
    var threshold = 100 / Math.floor($("#image-holder > div").length);

    for (var tick = threshold; tick <= 100; tick+=threshold) {
        transitions.push(tick);
    }

    var widget_options = '&color=000000&show_artwork=false&auto_play=true';

    $.getJSON('http://soundcloud.com/oembed.json?url=' + soundcloud_url + widget_options)
      .done(function (data) {
        var widget;
        // data.html will contain widget HTML that you can embed
        $('#sc-widget').html( data.html );

        // Create API enabled reference to the widget
        widget = SC.Widget($('#sc-widget').find('iframe')[0]);

        // Interact with widget via API
        widget.bind('ready', function () {
            spinner.stop();
            $('#loading').hide();
        });

        // Play events
        widget.bind(SC.Widget.Events.PLAY, function() {
            // get information about currently playing sound
            widget.getCurrentSound(function(currentSound) {
                console.log(currentSound);
            });
        });

        // Progress events
        widget.bind(SC.Widget.Events.PLAY_PROGRESS, function(obj) {
            var index = Math.floor(obj.relativePosition / threshold * 100) + 1;
            console.log(index);

            // hide all images besides the current index
            for (var i = 0; i <= $("#image-holder > div").length; i++) {
                var selector = '#image' + i;
                $(selector).addClass('hide');
            }

            selector = '#image' + index;
            $(selector).removeClass('hide');

        });
    });
}