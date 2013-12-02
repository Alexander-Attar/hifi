var spinner;
var tags = [
    'gif', 'art', 'technology', 'music', 'sound', 'science', 'love', 'light', 'dark', 'electronic', 'cyber', 'nyc'
];

function createSpinnder() { // ridin' spinners
var opts = {
  lines: 7, // The number of lines to draw
  length: 0, // The length of each line
  width: 10, // The line thickness
  radius: 10, // The radius of the inner circle
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
            $('#no-account').hide();
            $('#instructions').removeClass('hide');
            $('#my-sounds').removeClass('hide');
            $('#genres').removeClass('hide');

            SC.get("/me", function(me){
                console.log(me);
            });
        });
    });
});

$('#no-account').click(function(e) {
    $('#no-account').hide();
    $('#project-description').hide();
    $('#connect').hide();
    $('#not-connected-instructions').removeClass('hide');
    $('#genres').removeClass('hide');

});

// TODO - Combine logic for click events for user and genre buttons
/* Grab an uploaded track from a user's sounds or one of their favorite sounds */
$('.me').click(function(e) {
    $('#instructions').hide();
    $('#track-finished').hide();
    // createSpinnder();
    $('#loading').show();
    $('#sound-load-error').hide();
    var selection = $(e.target).closest('.btn').text().toLowerCase();

    // get images from tumblr
    tumble(tags, selection);
});

/*  Grab a random track based on genre selected */
$('.genre').click(function(e) {
    $('#instructions').hide();
    $('#not-connected-instructions').hide();
    $('#track-finished').hide();
    // createSpinnder();
    $('#loading').show();
    $('#sound-load-error').hide();
    var selection = $(e.target).closest('.btn').text().toLowerCase();

    // get images from tumblr
    tumble(tags, selection);
});

/* Pick the API endpoint based on selection and make the request to SoundCloud */
function getTracks(selection) {

    // TODO - refactor this logic
    // Not the best way to differentiate between the url to hit, but it works for now
    var soundcloud_url = null;

    if (selection == 'my sounds') {
        soundcloud_url = '/me/tracks';
    }
    if (selection == 'my favorites'){
        soundcloud_url = '/me/favorites';
    }
    if (soundcloud_url) {
        try {  // sometimes the request to the SoundCloud API bombs out. this handles that
            SC.get(soundcloud_url, function(tracks) {
                // get a random track from the sounds returned
                var random = Math.floor(Math.random() * tracks.length);
                var soundcloud_url = tracks[random].permalink_url;
                setupWidget(soundcloud_url);
            });
        } catch(e) {
            console.log(e.message);
            $('#sound-load-error').removeClass('hide');
            $('#sound-load-error').show();
        }
    }
    else {  // user clicked a genre button
        // increase the amount of tracks returned from 50 to 200 and change offset randomly for more variance
        try {
            SC.get('/tracks', {
                genres: selection, limit: 200, offset: Math.floor(Math.random() * 7999)
            }, function(tracks) {
                // get a random track from the 200 returned
                var random = Math.floor(Math.random() * 199);
                var soundcloud_url = tracks[random].permalink_url;
                setupWidget(soundcloud_url);
            });
        } catch(e) {
            console.log(e.message);
            $('#sound-load-error').removeClass('hide');
            $('#sound-load-error').show();
        }
    }
}

/* Parses the images returned from Tumblr */
function getImages(data, images) {

    for (var i = 0; i < data.response.length; i++) {

        // get the image url from the post
        if (data.response[i].photos){
            images.push(data.response[i].photos[0].original_size.url);
        }
    }
}

/* Contains the main logic for requesting images from Tumblr */
function tumble(tags, selection) {

    // images = [];  // reset images
    $('#image-holder').empty();  // clear out images in the DOM
    embedImages(images, selection);

    // ====================================================================================
    // Moved the request logic to be on the backend to significantly decrease load time !
    // ====================================================================================
    // var timestamp = Date.now() * 0.001;
    // 15 requests to tumblr or about 300 images
    // seems to create an engaging experience for most normal length sounds
    // for (var i = 0; i < 15; i++) {
    //     console.log(i);

        // this is a hack on tumblr's API to retrieve more than 20 images by navigating back in time via timestamp
        // var seed = Math.floor((Math.random()*10)+1);  // randomizes the images returned from tumblr more
        // timestamp -= 10500 * seed;  // this is kind of arbitrary, just the result of experimenting

        // var url = 'http://api.tumblr.com/v2/tagged?api_key=YP7Ou3HkhMg9eXEsHK3ZEXK041U8yhhnrzhZIrJd47y498Cd7c&tag=gif&before=' + timestamp;

        // dynamically name requests so we can wait for them to complete
        // var name = 'r' + i;
        // window[name] = $.ajax({
        //     async: false,
        //     url: url,
        //     dataType: "jsonp",
        //     jsonp: 'jsonp'}).success(function(data){ getImages(data, images);
        // });
    // }
    // wait for all ajax requests to be done
    // TODO - make the number of requests to wait for dynamic
    // $.when(r0, r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14).done(function(){
    //    embedImages(images, selection);
    // });
}

/* Useful for shuffling images to create different ordering for each play */
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

/* Injects the images into the DOM */
function embedImages(images, selection) {

    // randomize the order of the images and limit it to the first 300 images
    images = shuffle(images).slice(0, 300);

    for (var i = 0; i < images.length; i++) {
        var imageId = 'image' + i;
        $('#image-holder').append('<div id="' + imageId + '" class="row text-center hide"><img src="'+ images[i] + '"></div>');
    }

    // once the images are loaded we can get the audio and set the image transition points
    getTracks(selection);
}

/* Handles SoundCloud widget events, and contains logic for transitioning between images */
function setupWidget(soundcloud_url) {

    // the total duration of 100 percent of the audio is divided by the amount of images
    // and the value is used to create the transiton points that are hit by an incrementing
    // index as the sound progresses over time
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
        // widget.bind('ready', function () {
        //     spinner.stop();
        //     $('#loading').hide();
        // });

        // Play events
        widget.bind(SC.Widget.Events.PLAY, function() {
            // get information about currently playing sound
            widget.getCurrentSound(function(currentSound) {
                console.log(currentSound);
            });

            $('#track-finished').hide();
        });

        // Progress events
        widget.bind(SC.Widget.Events.PLAY_PROGRESS, function(obj) {
            var index = Math.floor(obj.relativePosition / threshold * 100) + 1;

            // hide all images besides the current index
            for (var i = 0; i <= $("#image-holder > div").length; i++) {
                var selector = '#image' + i;
                $(selector).addClass('hide');
            }
            selector = '#image' + index;
            $(selector).removeClass('hide');
        });

        widget.bind(SC.Widget.Events.FINISH, function(obj) {
            $('#track-finished').show();
            $('#track-finished').removeClass('hide');
        });
    });
}