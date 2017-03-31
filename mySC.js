$(document).ready(function() {

  // Queue up a SoundCloud song to play via the song url
  var song = 'https://soundcloud.com/chancetherapper/acid-rain-1';
  playSC(song, false); // false = don't autoPlay, true = autoPlay
  getSCinfo(song);
  var player = SC.Widget("so");

  // Play button pressed
  $("#play").click(function() {
    player.play();
  });

  // Pause button pressed
  $("#pause").click(function() {
    player.pause();
  });

  // New SoundCloud URL requested via prompt()
  $("#newSong").click(function() {
    var url = prompt("Enter in a new SoundCloud URL:");
    if(url !== null){
      playSC(url, true);
      getSCinfo(url);
    }
  });
})

function playSC(song, autoPlay){
  // Set up URL
  var uri = encodeURIComponent(song);
  var scUrl ='https://w.soundcloud.com/player/?url='+uri;
  // Set iFrame source
  $("#so").prop('src', scUrl);
  // Play song after 1 sec delay
  $("#so").on("load", function () {
      setTimeout(function(){
        if(autoPlay === true){
          var player = SC.Widget("so");
          player.play();
        }
      }, 1000);
  });
}

function getSCinfo(song){
  // Get SC song info from oembed.js
  var uri = encodeURIComponent(song);
  var scUrl = 'https://soundcloud.com/oembed.json?maxheight=200&url='+uri;
  $.get(scUrl, function(data){
    // Populate the data onto the web-page
    var thumb_https = data.thumbnail_url.replace(/^http:\/\//i, 'https://');
    $("#thumbnail").prop("src", thumb_https);
    $("#song_title").html('<i class="fa fa-music" aria-hidden="true"></i> ' + data.title);
    $("#song_artist").html('<i class="fa fa-user" aria-hidden="true"></i> ' + data.author_name);
  })
}
