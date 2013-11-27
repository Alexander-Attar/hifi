$(document).ready(function() {
    SC.initialize({
      client_id: '51e5315d2d8046ad3b14ba65871265b2',
      redirect_uri: "http://127.0.0.1:8000/"
    });
});

$("#connect").live("click", function(){
    SC.connect(function(){
        SC.get("/me", function(me){
            $("#username").text(me.username);
            $("#description").val(me.description);
        });
    });
});

$('.genre').click(function(e) {
    // $('#genres').hide();
    $('#sound-load-error').hide();
    play($(e.target).closest('.btn').text().toLowerCase());
});

function play(genre) {

    // increase the amount of tracks returned from 50 to 200 and change offset randomly for more variance
    SC.get('/tracks', { genres: genre, limit: 200, offset: Math.floor(Math.random() * 7999) }, function(tracks) {

        // get a random track from the 200 returned
        var random = Math.floor(Math.random() * 199);
        var track_url = tracks[random].permalink_url;

        // embed the track using the url
        SC.oEmbed(track_url, {auto_play: true, color: "000000", show_artwork: false}, function(callback) {
            try {
                $("#sc-widget").html(callback.html);
            }
            catch(e) {  // for some sounds embedding bombs out so this handles that
                $('#sound-load-error').show();
                console.log('There was a problem loading that sound');
            }
        });
    });
}