var widget;
var selection;
var trackIds = [];  // lets us keep a history of the sounds played
var authorized = false;

$('#fullscreen').click(function(e){  // enable fullscreen
    $('#image-holder').removeClass('col-md-8');
    $('#image-holder').fullScreen();
});

document.onkeydown = checkKey;

/* perform various player logic based on key presses */
function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '39' && e.shiftKey) {  // right arrow + shift
        tumble(selection);
    }
    if (e.keyCode == '37' && e.shiftKey) {  // left arrow + shift
        getPrevious(trackIds[trackIds.length - 2]);
    }
    if (e.keyCode == '38' && e.shiftKey) {  // up arrow + shift
        if (widget) {
            widget.getVolume(function(volume) {
                if (volume < 100) {
                    widget.setVolume(volume + 10);
                }
            });
        }
    }
    if (e.keyCode == '40' && e.shiftKey) {  // down arrow + shift
        console.log('Down Arrow. Volume down');
        if (widget) {
            widget.getVolume(function(volume) {
                if (volume > 0) {
                    widget.setVolume(volume - 10);
                }
            });
        }
    }
    if (e.keyCode == '70') {  // F key
        $('#image-holder').removeClass('col-md-8');
        $('#image-holder').fullScreen();
    }
    if (e.keyCode == '76') {  // L key
        if (authorized) {  // only if connected
            console.log('L Key. Liking track');
            likeSound(trackIds[trackIds.length - 1]);  // current track
        }
    }
    if (e.keyCode == '32') {  // space
        console.log('Space Key');
        if (widget) {  // make sure widget is instantiated first
            widget.isPaused(function(paused) {
                if (paused) {
                    widget.play();
                } else {
                    widget.pause();
                }
            });
        }
    }
    if (e.keyCode == '75') {  // K key
        if ($('#shortcuts-modal').hasClass('in')) {
            $('#shortcuts-modal').modal('hide');
        } else {
            $('#shortcuts-modal').modal('show');
        }
    }
}

$(document).ready(function() {
    SC.initialize({
      client_id: '51e5315d2d8046ad3b14ba65871265b2',
      redirect_uri: "http://hifi.herokuapp.com/"
    });
    $('#loading').hide();
});

$("#connect").live("click", function(){
    SC.connect(function() {
        SC.get("/me", function(me) {
            authorized = true;
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
    $('#loading').show();
    $('#sound-load-error').hide();
    selection = $(e.target).closest('.btn').text().toLowerCase();

    // get images from tumblr
    tumble(selection);
});

/*  Grab a random track based on genre selected */
$('.genre').click(function(e) {
    $('#instructions').hide();
    $('#not-connected-instructions').hide();
    $('#track-finished').hide();
    $('#loading').show();
    $('#sound-load-error').hide();
    selection = $(e.target).closest('.btn').text().toLowerCase();

    // get images from tumblr
    tumble(selection);
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
                var soundcloud_url = getNext(tracks);
                setupWidget(soundcloud_url, selection);
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
                var soundcloud_url = getNext(tracks);
                setupWidget(soundcloud_url);
            });
        } catch(e) {
            console.log(e.message);
            $('#sound-load-error').removeClass('hide');
            $('#sound-load-error').show();
        }
    }
}

/* Prevents the same track from playing */
function getNext(tracks) {
    var random = Math.floor(Math.random() * tracks.length);
    var trackId = tracks[random].id;
    // while the track is in the list of played tracks search for another track
    while ($.inArray(trackId, trackIds) > -1)  {
        console.log('That track has already been played. Searching for another one');
        random = Math.floor(Math.random() * tracks.length);
        trackId = tracks[random].id;
    }
    trackIds.push(trackId);  // keep this so we can get the previous track
    return tracks[random].uri;
}

/* Look in the track ID history and play the previously played track */
function getPrevious(trackId) {
    var soundcloud_url = '/tracks/' + trackId;
    SC.get(soundcloud_url, 'allow_redirects=False', function(track) {
        setupWidget(track.permalink_url, selection);
    });
}

function likeSound(trackId) {
    var soundcloud_url = '/me/favorites/' + trackId;
    SC.put(soundcloud_url, function(track){
        console.log(track);
    });
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
function tumble(selection) {
    images = shuffle(images);
    $('#image-holder').empty();  // clear out images in the DOM
    getTracks(selection);
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

/* Handles SoundCloud widget events, and contains logic for transitioning between images */
function setupWidget(soundcloud_url, selection) {
    // the total duration of 100 percent of the audio is divided by the amount of images
    // and the value is used to create the transiton points that are hit by an incrementing
    // index as the sound progresses over time
    var transitions = [];

    // Lazy loading the images is faster, but the div won't have a length so we must set the length
    // manually. Currently it is set to 300
    // var threshold = 100 / Math.floor($("#image-holder > div").length);
    threshold = 100 / 300;

    for (var tick = threshold; tick <= 100; tick+=threshold) {
        transitions.push(tick);
    }

    var widget_options = '&color=000000&show_artwork=false&visual=true&auto_play=true';

    $.getJSON('http://soundcloud.com/oembed.json?url=' + soundcloud_url + widget_options)
      .done(function (data) {

        // data.html will contain widget HTML that you can embed
        $('#sc-widget').html(data.html);

        // show the viewfinder once the sound is loaded
        $('#player').removeClass('hide');

        // Create API enabled reference to the widget
        widget = SC.Widget($('#sc-widget').find('iframe')[0]);

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

            /* Injects the images into the DOM */
            // I moved the image loading logic here to load one image at a time
            var imageId = 'image' + index;
            $('#image-holder').append('<div id="' + imageId + '" class="row images text-center hide"><img src="'+ images[index] + '"></div>');

            // hide all images besides the current index
            for (var i = 0; i <= $("#image-holder > div").length; i++) {
                var selector = '#image' + i;
                $(selector).addClass('hide');
            }
            selector = '#image' + index;
            $(selector).removeClass('hide');
        });

        widget.bind(SC.Widget.Events.FINISH, function(obj) {
            // Automatically pick a new track of the same genre and continue playing
            tumble(selection);
        });
    });
}