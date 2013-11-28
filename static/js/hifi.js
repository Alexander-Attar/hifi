
var spinner;

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
      redirect_uri: "http://127.0.0.1:8000/"
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


// Grab an uploaded track from a user's sounds or one of their favorite sounds
$('.me').click(function(e) {
    $('#instructions').hide();
    createSpinnder();
    $('#loading').show();
    $('#sound-load-error').hide();

    if ($(e.target).closest('.btn').text().toLowerCase() == 'my sounds') {
        api_url = '/me/tracks';
    }

    if ($(e.target).closest('.btn').text().toLowerCase() == 'my favorites'){
        api_url = '/me/favorites';
    }

    SC.get(api_url, function(tracks) {
        // get a random track from the sounds returned
        var random = Math.floor(Math.random() * tracks.length);
        var soundcloud_url = tracks[random].permalink_url;
        setupWidget(soundcloud_url);
    });
});

// Grab a random track based on genre selected
$('.genre').click(function(e) {
    $('#instructions').hide();
    createSpinnder();
    $('#loading').show();
    $('#sound-load-error').hide();
    var genre = $(e.target).closest('.btn').text().toLowerCase();

    // increase the amount of tracks returned from 50 to 200 and change offset randomly for more variance
    SC.get('/tracks', { genres: genre, limit: 200, offset: Math.floor(Math.random() * 7999) }, function(tracks) {

        // get a random track from the 200 returned
        var random = Math.floor(Math.random() * 199);
        var soundcloud_url = tracks[random].permalink_url;
        setupWidget(soundcloud_url);
    });
});

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