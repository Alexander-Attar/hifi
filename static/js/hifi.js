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
    $('.genre').hide();
    play($(e.target).closest('.btn').text());
});

$('.page-header').click(function() {
    $('.genre').show();
});

function play(genre) {
    SC.get('/tracks', { genres: genre }, function(tracks) {
        // get a random track from the 50 returned
        var random = Math.floor(Math.random() * 49);
        var track_url = tracks[random].permalink_url;

        // embed the track using the url
        SC.oEmbed(track_url, {auto_play: true, color: "000000", show_artwork: false}, function(e) {
            $("#sc-widget").html(e.html);
        });
    });
}